import { AwilixContainer } from "awilix";
import { EConditionSegment, EMailTemplateHtmlReplace, ETimeTypeSegment } from "../admin/constants/enum";

const segmentJob = async (container: AwilixContainer, options: Record<string, any>) => {
  const jobSchedulerService = container.resolve("jobSchedulerService");
  const sesService = container.resolve("sesService");
  const segmentRepository = container.resolve("segmentRepository");
  const cartRepository = container.resolve("cartRepository");
  const mailTemplateRepository = container.resolve("mailTemplateRepository");
  const segmentHandleLogRepository = container.resolve("segmentHandleLogRepository");

  const parseMilliseconds = (number: number, timeType: ETimeTypeSegment) => {
    let result: number;
    switch (timeType) {
      case ETimeTypeSegment.MINUTE:
        result = number * 60 * 1000;
        break;
      case ETimeTypeSegment.HOUR:
        result = number * 60 * 60 * 1000;
        break;
      case ETimeTypeSegment.DAY:
        result = number * 24 * 60 * 60 * 1000;
        break;
      case ETimeTypeSegment.WEEK:
        result = number * 7 * 24 * 60 * 60 * 1000;
        break;
      case ETimeTypeSegment.MONTH:
        result = number * 30 * 24 * 60 * 60 * 1000;
        break;
    }
    return result;
  };

  const replaceHtml = (html: string, content: string, heading: string, preheader: string) => {
    return html
      .replaceAll(EMailTemplateHtmlReplace.CONTENT, content)
      .replaceAll(EMailTemplateHtmlReplace.HEADING, heading)
      .replaceAll(EMailTemplateHtmlReplace.PREHEADER, preheader);
  };

  jobSchedulerService.create("handle-segment", {}, "*/1 * * * *", async () => {
    const segments = await segmentRepository.find();
    const p = [];
    segments.forEach(async (segment) => {
      switch (segment.condition) {
        case EConditionSegment.CHECKOUT_BUT_DONT_BUY:
          const carts = await cartRepository
            .createQueryBuilder("cart")
            .select()
            .where("cart.payment_id IS NULL")
            .andWhere("cart.email IS NOT NULL")
            .andWhere("EXISTS (SELECT * FROM line_item l WHERE l.cart_id = cart.id)")
            .getMany();

          if (carts.length) {
            const timeCheck = parseMilliseconds(segment.timeValue, segment.timeType);
            const now = Date.now();
            const [templateNormal, templateVip] = await Promise.all([
              mailTemplateRepository.findOne({
                where: { id: segment.templateNormalId },
              }),
              mailTemplateRepository.findOne({
                where: { id: segment.templateVipId },
              }),
            ]);
            const html = replaceHtml(
              templateNormal.data,
              segment.mailContent,
              segment.mailHeading,
              segment.mailPreheader
            );

            carts.forEach((cart) => {
              const cartCreatedTime = new Date(cart.created_at).getTime();
              var difference = now - cartCreatedTime;
              if (difference >= timeCheck) {
                p.push(
                  sesService.transporter_.sendMail({
                    from: process.env.SES_FROM,
                    to: cart.email,
                    subject: segment.mailSubject || `No reply`,
                    html,
                    text: "",
                  }),
                  segmentHandleLogRepository.save(
                    segmentHandleLogRepository.create({
                      segmentId: segment.id,
                      cartId: cart.id,
                    })
                  )
                );
              }
            });
          }
          break;
        case "":
          break;
      }
    });

    await Promise.all(p);
  });
};

export default segmentJob;
