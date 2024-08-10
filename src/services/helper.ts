import { TransactionBaseService } from '@medusajs/medusa';

class MedusaHelper extends TransactionBaseService {
  waitForSecondTime(time) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('resolved');
      }, time * 1000);
    });
  }

  sortClothesSize(data) {
    const order = [
      'one size',
      '2xs',
      'xxs',
      'xs',
      's',
      'm',
      'l',
      'xl',
      '2xl',
      'xxl',
      '3xl',
      'xxxl',
      '4xl',
      'xxxxl',
      '5xl',
      'xxxxxl',
      '6xl',
      'xxxxxxl',
      '7xl',
      'xxxxxxxl',
      '8xl',
      'xxxxxxxxl',
      '9xl',
      'xxxxxxxxxl',
      '10xl',
      'xxxxxxxxxxl',
      '11xl',
      'xxxxxxxxxxxl',
      '12xl',
      'xxxxxxxxxxxxl',
      'os',
    ];

    data.sort((prodA, prodB) => {
      const a = prodA.title.toLowerCase();
      const b = prodB.title.toLowerCase();

      let nra = parseInt(a);
      let nrb = parseInt(b);

      if (order.indexOf(a) != -1) nra = NaN;
      if (order.indexOf(b) != -1) nrb = NaN;

      if (nrb === 0) return 1;
      if ((nra && !nrb) || nra === 0) return -1;
      if (!nra && nrb) return 1;
      if (nra && nrb) {
        if (nra == nrb) {
          return a
            .substr(('' + nra).length)
            .localeCompare(a.substr(('' + nra).length));
        } else {
          return nra - nrb;
        }
      } else {
        return order.indexOf(a) - order.indexOf(b);
      }
    });

    return data;
  }

  parseAmountAndMultiply(amount: number, fixed: number, multiplyBy: number) {
    return Number(
      (Number(Number(amount).toFixed(fixed)) * multiplyBy)
        .toString()
        .split('.')[0]
    );
  }

  validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };
}

export default MedusaHelper;
