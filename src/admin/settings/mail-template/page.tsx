import type { SettingConfig } from '@medusajs/admin';
import { EnvelopeSolid } from '@medusajs/icons';
import BackButton from '../../components/shared/back-button';
import BodyCard from '../../components/shared/body-card';
import Spacer from '../../components/shared/spacer';
import { MailTemplate } from '../../../models/mail-template';
import {
  useAdminCustomQuery,
  useAdminCustomPost,
  useAdminCustomDelete,
} from 'medusa-react';
import {
  Table,
  Toaster,
  useToast,
  FocusModal,
  Input,
  Button,
  Heading,
  DropdownMenu,
  Code,
  Copy,
  Select,
  Text,
} from '@medusajs/ui';
import Spinner from '../../components/shared/spinner';
import { useState, useMemo } from 'react';
import { Pagination } from 'nestjs-typeorm-paginate';
import PaginationTable from '../../types/pagination-table';
import {
  PaginationDefault,
  DefaultCodeHtmlTemplate,
} from '../../constants/constant';
import { Container } from '../../components/shared/container';
import { useEffect } from 'react';
import dayjs from 'dayjs';
import { EllipsisHorizontal, PencilSquare, Plus, Trash } from '@medusajs/icons';
import PreviewHtml from '../../components/shared/preview-html';
import Editor from 'react-simple-code-editor';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';
import {
  EMailAvailableVariables,
  EMailTemplateHtmlReplace,
  ETypeTemplateMail,
} from '../../constants/enum';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export type MailTemplateGetQuery = {
  limit: number;
  page: number;
};

export type MailTemplateGetRes = {
  data: Pagination<MailTemplate>;
};
export type MailTemplateUpdateReq = {
  data: string;
  title: string;
};

export type SendMailReq = {
  to: string;
  subject: string;
  heading?: string;
  preheader?: string;
  templateNormalId: string;
  templateVipId?: string;
  content?: string;
};

export type MailTemplateUpdateRes = {
  data: boolean;
};

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const CustomMailTemplate = () => {
  const { toast } = useToast();
  const [isCkEditor, setIsCkEditor] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openModalSendMail, setOpenModalSendMail] = useState<boolean>(false);
  const [openModalPreviewMail, setOpenModalPreviewMail] =
    useState<boolean>(false);

  const defaultMailTemplateEdit = {
    id: '',
    title: '',
    data: DefaultCodeHtmlTemplate,
  };

  const defaultSendMailData = {
    to: '',
    subject: '',
    heading: '',
    preheader: '',
    templateNormalId: '',
    templateVipId: '',
    content: '',
  };

  const [currentMailTemplateEdit, setCurrentMailTemplateEdit] = useState<{
    id?: string;
    title: string;
    data: string;
  }>(defaultMailTemplateEdit);
  const [sendMailData, setSendMailData] =
    useState<SendMailReq>(defaultSendMailData);
  const [mailSendPreview, setMailSendPreview] = useState<string>('');

  const [pagination, setPagination] =
    useState<PaginationTable>(PaginationDefault);

  const {
    data: dataMailTemplates,
    isLoading,
    refetch,
  } = useAdminCustomQuery<MailTemplateGetQuery, MailTemplateGetRes>(
    '/mail-template',
    [],
    {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
    }
  );

  const { mutate: mutateUpdate, isLoading: isLoadingUpdate } =
    useAdminCustomPost<MailTemplateUpdateReq, MailTemplateUpdateRes>(
      `/mail-template/update/${currentMailTemplateEdit?.id}`,
      []
    );
  const { mutate: mutateCreate, isLoading: isLoadingCreate } =
    useAdminCustomPost<MailTemplateUpdateReq, MailTemplateUpdateRes>(
      `/mail-template`,
      []
    );
  const { mutate: mutateDelete, isLoading: isLoadingDelete } =
    useAdminCustomDelete<MailTemplateUpdateRes>(
      `/mail-template/${currentMailTemplateEdit?.id}`,
      []
    );
  const { mutate: mutateSendMail, isLoading: isLoadingSendMail } =
    useAdminCustomPost<SendMailReq, MailTemplateUpdateRes>(`/send-mail`, []);

  const loading =
    isLoading ||
    isLoadingUpdate ||
    isLoadingCreate ||
    isLoadingDelete ||
    isLoadingSendMail;

  const mailTemplates = useMemo(() => {
    const meta = dataMailTemplates?.data.meta;

    if (meta) {
      setPagination({
        pageIndex: meta.currentPage - 1,
        pageSize: meta.itemsPerPage,
        count: meta.itemCount,
        pageCount: meta.totalPages,
        canPreviousPage: meta.currentPage > 1,
        canNextPage: meta.totalPages > meta.currentPage,
      });
    }

    return (
      dataMailTemplates?.data.items.map((e) => ({
        id: e.id,
        title: e.title,
        data: e.data || '',
        created_at: e.created_at,
        updated_at: e.updated_at,
      })) || []
    );
  }, [dataMailTemplates]);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setOpenModal(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const columns = [
    {
      title: '#',
      key: '#',
    },
    {
      title: 'Title',
      key: 'title',
    },
    {
      title: 'Created Date',
      key: 'created_at',
    },
    {
      title: 'Updated Date',
      key: 'updated_at',
    },
    {
      title: 'Action',
      key: 'action',
    },
  ];

  const handleCreateMailTemplate = (values) => {
    mutateCreate(
      { data: values.data, title: values.title },
      {
        onSuccess: () => {
          refetch();
          toast({
            title: 'Create Successful',
            description: 'Create Mail Template Successful',
            variant: 'success',
            duration: 1500,
          });
        },
        onError: () => {
          toast({
            title: 'Action Error',
            description: 'Something went wrong',
            variant: 'error',
            duration: 1500,
          });
        },
      }
    );
    setOpenModal(false);
    setCurrentMailTemplateEdit(defaultMailTemplateEdit);
  };

  const handleUpdateMailTemplate = (values) => {
    mutateUpdate(
      { data: values.data, title: values.title },
      {
        onSuccess: () => {
          refetch();
          toast({
            title: 'Update Successful',
            description: 'Update Mail Template Successful',
            variant: 'success',
            duration: 1500,
          });
        },
        onError: () => {
          toast({
            title: 'Action Error',
            description: 'Something went wrong',
            variant: 'error',
            duration: 1500,
          });
        },
      }
    );
    setOpenModal(false);
    setCurrentMailTemplateEdit(defaultMailTemplateEdit);
  };

  const handleDeleteMailTemplate = () => {
    mutateDelete(undefined, {
      onSuccess: () => {
        refetch();
        toast({
          title: 'Delete Successful',
          description: 'Delete Mail Template Successful',
          variant: 'success',
          duration: 1500,
        });
      },
      onError: () => {
        toast({
          title: 'Action Error',
          description: 'Something went wrong',
          variant: 'error',
          duration: 1500,
        });
      },
    });
    setCurrentMailTemplateEdit(defaultMailTemplateEdit);
  };

  const handleSendMail = () => {
    if (
      !validateEmail(sendMailData.to) &&
      !sendMailData.to.includes(EMailAvailableVariables.GUEST_EMAIL) &&
      !sendMailData.to.includes(EMailAvailableVariables.USER_EMAIL)
    ) {
      toast({
        title: 'Action Error',
        description: `Send Mail invalid parameters, can only is email or ${EMailAvailableVariables.GUEST_EMAIL} or ${EMailAvailableVariables.USER_EMAIL}`,
        variant: 'error',
        duration: 1500,
      });
      return;
    }

    if (!sendMailData.templateNormalId) {
      toast({
        title: 'Action Error',
        description: `Template is require`,
        variant: 'error',
        duration: 1500,
      });
      return;
    }

    mutateSendMail(sendMailData, {
      onSuccess: () => {
        refetch();
        toast({
          title: 'Send Mail Successful',
          description: 'Send Mail Mail Successful',
          variant: 'success',
          duration: 1500,
        });
      },
      onError: () => {
        toast({
          title: 'Action Error',
          description: 'Something went wrong',
          variant: 'error',
          duration: 1500,
        });
      },
    });
    setOpenModalSendMail(false);
    setSendMailData(defaultSendMailData);
  };

  const handlePreviewMailSend = (typeTemplate) => {
    const idTemplate =
      typeTemplate === ETypeTemplateMail.NORMAL
        ? sendMailData.templateNormalId
        : sendMailData.templateVipId;
    const template = mailTemplates.find((e) => e.id === idTemplate);
    const html = template.data
      .replaceAll(EMailTemplateHtmlReplace.CONTENT, sendMailData.content)
      .replaceAll(EMailTemplateHtmlReplace.HEADING, sendMailData.heading)
      .replaceAll(EMailTemplateHtmlReplace.PREHEADER, sendMailData.preheader);

    setMailSendPreview(html);
    setOpenModalPreviewMail(true);
  };

  const handleChangeSendMail = (event) => {
    setSendMailData((e) => {
      const data = Object.assign({}, e);
      data[event.target.name] = event.target.value;
      return data;
    });
  };

  const handleChangeTemplateSendMail = (keyTemplate, value) => {
    setSendMailData((e) => {
      const data = Object.assign({}, e);
      data[keyTemplate] = value;
      return data;
    });
  };

  const previousPage = () => {
    setPagination((e) => {
      const data = Object.assign({}, e);
      data.pageIndex -= 1;
      return data;
    });
  };

  const nextPage = () => {
    setPagination((e) => {
      const data = Object.assign({}, e);
      data.pageIndex += 1;
      return data;
    });
  };

  const formikEditTemplate = useFormik({
    initialValues: currentMailTemplateEdit,
    onSubmit: async (values) => {
      if (
        !currentMailTemplateEdit.data.includes(
          EMailTemplateHtmlReplace.PREHEADER
        ) ||
        !currentMailTemplateEdit.data.includes(
          EMailTemplateHtmlReplace.HEADING
        ) ||
        !currentMailTemplateEdit.data.includes(EMailTemplateHtmlReplace.CONTENT)
      ) {
        toast({
          title: 'Action Error',
          description:
            'Template missing important parameters, please read warning',
          variant: 'error',
          duration: 1500,
        });
        return;
      }

      values.data = currentMailTemplateEdit.data;

      if (values?.id) handleUpdateMailTemplate(values);
      else handleCreateMailTemplate(values);

      formikEditTemplate.resetForm();
    },
    validationSchema: Yup.object().shape({
      title: Yup.string()
        .min(2, 'Too Short!')
        .max(100, 'Too Long!')
        .required('Required'),
    }),
  });

  return (
    <div>
      <BackButton
        label="Back to settings"
        path="/a/settings"
        className="mb-xsmall"
      />
      <BodyCard
        title="Mail Template"
        subtitle="Mail Template"
        actionables={[
          {
            label: 'New',
            variant: 'normal',
            onClick: async () => {
              setCurrentMailTemplateEdit(defaultMailTemplateEdit);
              setOpenModal(true);
            },
            icon: <Plus />,
          },
        ]}
        events={[
          {
            label: 'Send Mail',
            type: 'button',
            onClick: async () => {
              setOpenModalSendMail(true);
            },
          },
        ]}
      >
        <Toaster />
        {loading ? (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white bg-opacity-50">
            <Spinner variant="secondary" />
          </div>
        ) : (
          <div>
            <Table>
              <Table.Header>
                <Table.Row>
                  {columns.map((e) => (
                    <Table.HeaderCell key={e.key}>{e.title}</Table.HeaderCell>
                  ))}
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {mailTemplates.map((e, index) => {
                  return (
                    <Table.Row key={index}>
                      <Table.Cell>
                        {pagination.pageIndex * pagination.pageSize + index + 1}
                      </Table.Cell>
                      <Table.Cell>{e.title}</Table.Cell>
                      <Table.Cell>
                        {dayjs(e.created_at).format('YYYY-MM-DD HH:mm:ss')}
                      </Table.Cell>
                      <Table.Cell>
                        {dayjs(e.updated_at).format('YYYY-MM-DD HH:mm:ss')}
                      </Table.Cell>
                      <Table.Cell>
                        <DropdownMenu>
                          <DropdownMenu.Trigger asChild>
                            <EllipsisHorizontal cursor={'pointer'} />
                          </DropdownMenu.Trigger>
                          <DropdownMenu.Content>
                            <DropdownMenu.Item
                              className="gap-x-2 cursor-pointer"
                              onClick={() => {
                                setCurrentMailTemplateEdit(e);
                                formikEditTemplate.setValues(e);
                                setOpenModal(true);
                              }}
                            >
                              <PencilSquare className="text-ui-fg-subtle" />
                              Edit
                            </DropdownMenu.Item>
                            <DropdownMenu.Item
                              className="gap-x-2 cursor-pointer"
                              onClick={async () => {
                                await setCurrentMailTemplateEdit(e);
                                handleDeleteMailTemplate();
                              }}
                            >
                              <Trash className="text-ui-fg-subtle" />
                              Delete
                            </DropdownMenu.Item>
                          </DropdownMenu.Content>
                        </DropdownMenu>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table>
            <Table.Pagination
              count={pagination.count}
              pageSize={pagination.pageSize}
              pageIndex={pagination.pageIndex}
              pageCount={pagination.pageCount}
              canPreviousPage={pagination.canPreviousPage}
              canNextPage={pagination.canNextPage}
              previousPage={previousPage}
              nextPage={nextPage}
            />
          </div>
        )}
      </BodyCard>
      <Spacer />

      <FocusModal
        defaultOpen={false}
        open={openModal}
        onOpenChange={setOpenModal}
      >
        <FocusModal.Content>
          <form onSubmit={formikEditTemplate.handleSubmit}>
            <FocusModal.Header>
              <Button type="submit">Save</Button>
            </FocusModal.Header>
            <FocusModal.Body>
              <BodyCard
                title={`${
                  formikEditTemplate.values.id ? 'Update' : 'Create'
                } Mail Template`}
                subtitle={`${
                  formikEditTemplate.values.id ? 'Update' : 'Create'
                } Mail Template`}
              >
                <div className="flex flex-row gap-4">
                  <div className="basis-1/6">
                    <Container>
                      <Heading level="h1">Title</Heading>
                      <div className="h-10">
                        <Input
                          required
                          value={formikEditTemplate.values.title}
                          onChange={formikEditTemplate.handleChange}
                          placeholder="Title"
                          name="title"
                        />
                        {formikEditTemplate.errors.title && (
                          <Text className="text-ui-fg-error" size="small">
                            {formikEditTemplate.errors.title}
                          </Text>
                        )}
                      </div>
                    </Container>
                  </div>
                  <div className="basis-1/2">
                    <Container>
                      <Heading
                        level="h1"
                        className="border-ui-tag-orange-border"
                      >
                        Warning
                      </Heading>
                      <div className="h-10">
                        In the template content, it is required to have:
                        {(
                          Object.keys(EMailTemplateHtmlReplace) as Array<
                            keyof typeof EMailTemplateHtmlReplace
                          >
                        ).map((key) => (
                          <Copy
                            key={key}
                            content={EMailTemplateHtmlReplace[key]}
                          >
                            <Code>{EMailTemplateHtmlReplace[key]}</Code>
                          </Copy>
                        ))}
                      </div>
                    </Container>
                  </div>
                </div>
                <div className="flex flex-row gap-4">
                  <div className="basis-1/2 h-[64vh] overflow-scroll">
                    <Container>
                      <div className="flex justify-between mb-1">
                        <Heading level="h1">Template</Heading>
                        <Button onClick={() => setIsCkEditor(!isCkEditor)}>
                          Change Mode Editor
                        </Button>
                      </div>
                      <div>
                        {isCkEditor ? (
                          <CKEditor
                            editor={ClassicEditor}
                            data={currentMailTemplateEdit?.data}
                            onReady={(editor) => {
                              editor.editing.view.change((writer) => {
                                writer.setStyle(
                                  'height',
                                  '500px',
                                  editor.editing.view.document.getRoot()
                                );
                              });
                            }}
                            onChange={(event, editor) => {
                              const value = editor.getData();
                              setCurrentMailTemplateEdit((e) => {
                                const data = Object.assign({}, e);
                                data['data'] = value;
                                return data;
                              });
                            }}
                          />
                        ) : (
                          <Editor
                            required
                            textareaId="mail-template"
                            value={currentMailTemplateEdit?.data}
                            onValueChange={(code) => {
                              setCurrentMailTemplateEdit((e) => {
                                const data = Object.assign({}, e);
                                data['data'] = code;
                                return data;
                              });
                            }}
                            ignoreTabKey={true}
                            highlight={(code) => highlight(code, languages.js)}
                            padding={10}
                            style={{
                              fontFamily: '"Fira code", "Fira Mono", monospace',
                              fontSize: 12,
                            }}
                            autoFocus={true}
                          />
                        )}
                      </div>
                    </Container>
                  </div>
                  <div className="basis-1/2">
                    <Container>
                      <Heading level="h1">Preview</Heading>
                      <PreviewHtml html={currentMailTemplateEdit?.data} />
                    </Container>
                  </div>
                </div>
              </BodyCard>
            </FocusModal.Body>
          </form>
        </FocusModal.Content>
      </FocusModal>

      <FocusModal
        defaultOpen={false}
        open={openModalSendMail}
        onOpenChange={setOpenModalSendMail}
      >
        <FocusModal.Content>
          <FocusModal.Header>
            <Button onClick={handleSendMail}>Send</Button>
          </FocusModal.Header>
          <FocusModal.Body>
            <BodyCard title="Send Mail" subtitle="Send Mail">
              <div className="flex flex-row gap-4">
                <div className="basis-10/12">
                  <Container>
                    <div className="flex flex-row gap-4">
                      <div className="basis-2/12">
                        To
                        <span className="text-ui-fg-error">*</span>
                      </div>
                      <div className="basis-6/12">
                        <Input
                          required
                          value={sendMailData?.to}
                          onChange={handleChangeSendMail}
                          placeholder="To"
                          name="to"
                        />
                      </div>
                    </div>
                    <div className="flex flex-row gap-4 mt-2">
                      <div className="basis-2/12">
                        Email subject
                        <span className="text-ui-fg-error">*</span>
                      </div>
                      <div className="basis-6/12">
                        <Input
                          required
                          value={sendMailData?.subject}
                          onChange={handleChangeSendMail}
                          placeholder="Email Subject"
                          name="subject"
                        />
                      </div>
                    </div>
                    <div className="flex flex-row gap-4 mt-2">
                      <div className="basis-2/12">Email Heading</div>
                      <div className="basis-6/12">
                        <Input
                          value={sendMailData?.heading}
                          onChange={handleChangeSendMail}
                          placeholder="Email Heading"
                          name="heading"
                        />
                      </div>
                    </div>
                    <div className="flex flex-row gap-4 mt-2">
                      <div className="basis-2/12">Email Preheader</div>
                      <div className="basis-6/12">
                        <Input
                          value={sendMailData?.preheader}
                          onChange={handleChangeSendMail}
                          placeholder="Email Preheader"
                          name="preheader"
                        />
                      </div>
                    </div>
                    <div className="flex flex-row gap-4 mt-2">
                      <div className="basis-2/12">
                        Template
                        <span className="text-ui-fg-error">*</span>
                      </div>
                      <div className="basis-6/12">
                        <Select
                          value={sendMailData?.templateNormalId}
                          onValueChange={(value) =>
                            handleChangeTemplateSendMail(
                              'templateNormalId',
                              value
                            )
                          }
                          name="template-normal"
                        >
                          <Select.Trigger>
                            <Select.Value placeholder="Select Template" />
                          </Select.Trigger>
                          <Select.Content className="z-50">
                            {mailTemplates.map((e) => (
                              <Select.Item key={e.id} value={e.id}>
                                {e.title}
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select>
                      </div>
                      <div className="basis-2/12">
                        <Button
                          disabled={
                            sendMailData?.templateNormalId ? false : true
                          }
                          onClick={() =>
                            handlePreviewMailSend(ETypeTemplateMail.NORMAL)
                          }
                        >
                          Preview
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-row gap-4 mt-2">
                      <div className="basis-2/12">Template Vip</div>
                      <div className="basis-6/12">
                        <Select
                          value={sendMailData?.templateVipId}
                          onValueChange={(value) =>
                            handleChangeTemplateSendMail('templateVipId', value)
                          }
                          name="template-vip"
                        >
                          <Select.Trigger>
                            <Select.Value placeholder="Select Template" />
                          </Select.Trigger>
                          <Select.Content className="z-50">
                            {mailTemplates.map((e) => (
                              <Select.Item key={e.id} value={e.id}>
                                {e.title}
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select>
                      </div>
                      <div className="basis-2/12">
                        <Button
                          disabled={sendMailData?.templateVipId ? false : true}
                          onClick={() =>
                            handlePreviewMailSend(ETypeTemplateMail.VIP)
                          }
                        >
                          Preview
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-row gap-4 mt-2">
                      <div className="basis-2/12">Content</div>
                      <div className="basis-6/12">
                        <CKEditor
                          editor={ClassicEditor}
                          data={sendMailData?.content}
                          onReady={(editor) => {
                            editor.editing.view.change((writer) => {
                              writer.setStyle(
                                'height',
                                '300px',
                                editor.editing.view.document.getRoot()
                              );
                            });
                          }}
                          onChange={(event, editor) => {
                            const value = editor.getData();
                            setSendMailData((e) => {
                              const data = Object.assign({}, e);
                              data['content'] = value;
                              return data;
                            });
                          }}
                        />
                      </div>
                    </div>
                  </Container>
                </div>
                <div className="basis-2/12">
                  <Container>
                    <Heading level="h1" className="border-ui-tag-orange-border">
                      Available Variables:
                    </Heading>
                    <div>
                      {(
                        Object.keys(EMailAvailableVariables) as Array<
                          keyof typeof EMailAvailableVariables
                        >
                      ).map((key) => (
                        <div key={key}>
                          <Copy
                            className="mb-1"
                            content={EMailAvailableVariables[key]}
                          >
                            <Code>{EMailAvailableVariables[key]}</Code>
                          </Copy>
                        </div>
                      ))}
                    </div>
                  </Container>
                </div>
              </div>
            </BodyCard>
          </FocusModal.Body>
        </FocusModal.Content>
      </FocusModal>

      <FocusModal
        defaultOpen={false}
        open={openModalPreviewMail}
        onOpenChange={setOpenModalPreviewMail}
      >
        <FocusModal.Content>
          <FocusModal.Header></FocusModal.Header>
          <FocusModal.Body>
            <BodyCard title="Preview" subtitle="Preview">
              <PreviewHtml html={mailSendPreview} />
            </BodyCard>
          </FocusModal.Body>
        </FocusModal.Content>
      </FocusModal>
    </div>
  );
};

export const config: SettingConfig = {
  card: {
    label: 'Mail Template',
    description: 'Setting Mail Template',
    icon: EnvelopeSolid,
  },
};

export default CustomMailTemplate;
