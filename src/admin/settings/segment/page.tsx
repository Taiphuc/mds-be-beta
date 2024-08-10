import type { SettingConfig } from '@medusajs/admin';
import { Tools } from '@medusajs/icons';
import BackButton from '../../components/shared/back-button';
import BodyCard from '../../components/shared/body-card';
import Spacer from '../../components/shared/spacer';
import { Segment } from '../../../models/segment';
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
  DropdownMenu,
  Select,
  Switch,
} from '@medusajs/ui';
import Spinner from '../../components/shared/spinner';
import { useState, useMemo } from 'react';
import { Pagination } from 'nestjs-typeorm-paginate';
import PaginationTable from '../../types/pagination-table';
import {
  ConditionSegmentText,
  PaginationDefault,
} from '../../constants/constant';
import { Container } from '../../components/shared/container';
import { useEffect } from 'react';
import dayjs from 'dayjs';
import { EllipsisHorizontal, PencilSquare, Plus, Trash } from '@medusajs/icons';
import PreviewHtml from '../../components/shared/preview-html';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {
  EConditionSegment,
  EMailTemplateHtmlReplace,
  ETimeTypeSegment,
  ETypeTemplateMail,
} from '../../constants/enum';
import { MailTemplate } from '../../../models/mail-template';
import { Setting } from '../../../models/setting';

export type SegmentGetQuery = {
  limit: number;
  page: number;
};

export type SegmentGetRes = {
  data: Pagination<Segment>;
};

export type SettingGetRes = {
  data: Setting;
};

export type SegmentUpdateReq = {
  id?: string;
  title: string;
  condition: EConditionSegment | string;
  timeType: ETimeTypeSegment | string;
  timeValue: number;
  mailTo: string;
  mailSubject: string;
  mailHeading: string;
  mailPreheader: string;
  mailContent: string;
  templateNormalId: string;
  templateVipId: string;
  isActive: boolean;
};

export type SettingUpdateReq = {
  numberVipMailCondition: number;
};

export type SegmentUpdateRes = {
  data: boolean;
};

export type MailTemplateGetAllRes = {
  data: MailTemplate[];
};

const CustomSegment = () => {
  const { toast } = useToast();
  const [isUpdateStatus, setIsUpdateStatus] = useState(false)
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openModalPreviewMail, setOpenModalPreviewMail] =
    useState<boolean>(false);
  const [mailSendPreview, setMailSendPreview] = useState<string>('');
  const defaultSegmentEdit = {
    id: '',
    title: '',
    condition: '',
    timeType: '',
    timeValue: 1,
    mailTo: '',
    mailSubject: '',
    mailHeading: '',
    mailPreheader: '',
    mailContent: '',
    templateNormalId: '',
    templateVipId: '',
    isActive: false
  };

  const [numberVipMailCondition, setNumberVipMailCondition] =
    useState<number>(0);

  const [currentSegmentEdit, setCurrentSegmentEdit] =
    useState<SegmentUpdateReq>(defaultSegmentEdit);

  const [pagination, setPagination] =
    useState<PaginationTable>(PaginationDefault);

  const {
    data: dataSegments,
    isLoading,
    refetch,
  } = useAdminCustomQuery<SegmentGetQuery, SegmentGetRes>('/segment', [], {
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  });
  const { mutate: mutateUpdate, isLoading: isLoadingUpdate } =
    useAdminCustomPost<SegmentUpdateReq, SegmentUpdateRes>(
      `/segment/update/${currentSegmentEdit?.id}`,
      []
    );
  const { mutate: mutateCreate, isLoading: isLoadingCreate } =
    useAdminCustomPost<SegmentUpdateReq, SegmentUpdateRes>(`/segment`, []);
  const { mutate: mutateDelete, isLoading: isLoadingDelete } =
    useAdminCustomDelete<SegmentUpdateRes>(
      `/segment/${currentSegmentEdit?.id}`,
      []
    );
  const { data: dataMailTemplates, isLoading: isLoadingGetMailTemplate } =
    useAdminCustomQuery<undefined, MailTemplateGetAllRes>(
      '/mail-template/all',
      []
    );

  const {
    data: dataSetting,
    isLoading: isLoadingGetSetting,
    refetch: refeshGetSetting,
  } = useAdminCustomQuery<undefined, SettingGetRes>('/setting', []);

  const { mutate: mutateUpdateSetting, isLoading: isLoadingUpdateSetting } =
    useAdminCustomPost<SettingUpdateReq, SegmentUpdateRes>(
      `/setting/update`,
      []
    );

  const loading =
    isLoading ||
    isLoadingUpdate ||
    isLoadingCreate ||
    isLoadingDelete ||
    isLoadingGetMailTemplate ||
    isLoadingGetSetting ||
    isLoadingUpdateSetting;

  const segments = useMemo(() => {
    const meta = dataSegments?.data.meta;

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
      dataSegments?.data.items.map((e) => ({
        id: e.id,
        title: e.title,
        condition: e.condition,
        timeType: e.timeType,
        timeValue: e.timeValue,
        mailTo: e.mailTo,
        mailSubject: e.mailSubject,
        mailHeading: e.mailHeading,
        mailPreheader: e.mailPreheader,
        mailContent: e.mailContent,
        templateNormalId: e.templateNormalId,
        templateVipId: e.templateVipId,
        created_at: e.created_at,
        updated_at: e.updated_at,
        isActive: e.isActive
      })) || []
    );
  }, [dataSegments]);

  const mailTemplates = useMemo(() => {
    return (
      dataMailTemplates?.data.map((e) => ({
        id: e.id,
        title: e.title,
        data: e.data || '',
        created_at: e.created_at,
        updated_at: e.updated_at,
      })) || []
    );
  }, [dataMailTemplates]);

  useMemo(() => {
    setNumberVipMailCondition(dataSetting?.data?.numberVipMailCondition);
    return dataSetting?.data;
  }, [dataSetting]);

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
      title: 'Condition',
      key: 'condition',
    },
    {
      title: 'Time Type',
      key: 'time_type',
    },
    {
      title: 'Time Value',
      key: 'time_value',
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
      title: 'Is active',
      key: 'isActive',
    },
  ];

  const handleSegmentPost = () => {
    if (
      !currentSegmentEdit.title ||
      !currentSegmentEdit.condition ||
      !currentSegmentEdit.timeValue ||
      !currentSegmentEdit.timeType ||
      !currentSegmentEdit.mailSubject ||
      !currentSegmentEdit.templateNormalId
    ) {
      return toast({
        title: 'Action Error',
        description: 'Please fill out all require fields',
        variant: 'error',
        duration: 1500,
      });
    }

    if (currentSegmentEdit.id) return handleUpdateSegment();
    return handleCreateSegment();
  };

  const handleCreateSegment = () => {
    delete currentSegmentEdit.id;
    mutateCreate(currentSegmentEdit, {
      onSuccess: () => {
        refetch();
        toast({
          title: 'Create Successful',
          description: 'Create Segment Successful',
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
    setOpenModal(false);
    setCurrentSegmentEdit(defaultSegmentEdit);
  };

  const handleUpdateSegment = () => {
    mutateUpdate(currentSegmentEdit, {
      onSuccess: () => {
        refetch();
        toast({
          title: 'Update Successful',
          description: 'Update Segment Successful',
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
    setOpenModal(false);
    setCurrentSegmentEdit(defaultSegmentEdit);
  };

  const handleUpdateSetting = () => {
    mutateUpdateSetting(
      { numberVipMailCondition },
      {
        onSuccess: () => {
          refeshGetSetting();
          toast({
            title: 'Update Successful',
            description: 'Update Setting Successful',
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
  };

  const handleDeleteSegment = () => {
    mutateDelete(undefined, {
      onSuccess: () => {
        refetch();
        toast({
          title: 'Delete Successful',
          description: 'Delete Segment Successful',
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
    setCurrentSegmentEdit(defaultSegmentEdit);
  };

  const handleChangeWithKeyValue = (key, value) => {
    setCurrentSegmentEdit((e) => {
      const data = Object.assign({}, e);
      data[key] = value;
      return data;
    });
  };

  const handleChange = (event) => {
    setCurrentSegmentEdit((e) => {
      const data = Object.assign({}, e);
      data[event.target.name] = event.target.value;
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

  const handlePreviewMailSend = (typeTemplate) => {
    const idTemplate =
      typeTemplate === ETypeTemplateMail.NORMAL
        ? currentSegmentEdit.templateNormalId
        : currentSegmentEdit.templateVipId;
    const template = mailTemplates.find((e) => e.id === idTemplate);
    const html = template.data
      .replaceAll(
        EMailTemplateHtmlReplace.CONTENT,
        currentSegmentEdit.mailContent
      )
      .replaceAll(
        EMailTemplateHtmlReplace.HEADING,
        currentSegmentEdit.mailHeading
      )
      .replaceAll(
        EMailTemplateHtmlReplace.PREHEADER,
        currentSegmentEdit.mailPreheader
      );

    setMailSendPreview(html);
    setOpenModalPreviewMail(true);
  };

  useEffect(() => {
    if (isUpdateStatus) {
      handleUpdateSegment();
      setIsUpdateStatus(false);
      setCurrentSegmentEdit(defaultSegmentEdit)
    }
  }, [isUpdateStatus])

  return (
    <div>
      <BackButton
        label="Back to settings"
        path="/a/settings"
        className="mb-xsmall"
      />
      <BodyCard
        title="Segment"
        subtitle="Segment"
        actionables={[
          {
            label: 'New',
            variant: 'normal',
            onClick: async () => {
              setCurrentSegmentEdit(defaultSegmentEdit);
              setOpenModal(true);
            },
            icon: <Plus />,
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
            <div className="flex flex-row gap-4">
              <div className="basis-2/12">
                Conditions for receiving VIP mail:
              </div>
              <div className="basis-2/12">
                <Input
                  required
                  size="small"
                  type="number"
                  value={numberVipMailCondition}
                  onChange={(e) => {
                    setNumberVipMailCondition(Number(e.target.value));
                  }}
                  placeholder="Number Vip Mail Condition"
                  name="numberVipMailCondition"
                />
              </div>
              <div className="basis-2/12">
                <Button onClick={handleUpdateSetting}>Update</Button>
              </div>
            </div>
            <div className="mt-4">
              <Table>
                <Table.Header>
                  <Table.Row>
                    {columns.map((e) => (
                      <Table.HeaderCell key={e.key}>{e.title}</Table.HeaderCell>
                    ))}
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {segments.map((e, index) => {
                    return (
                      <Table.Row key={index}>
                        <Table.Cell>
                          {pagination.pageIndex * pagination.pageSize +
                            index +
                            1}
                        </Table.Cell>
                        <Table.Cell>{e.title}</Table.Cell>
                        <Table.Cell>
                          {
                            ConditionSegmentText.find(
                              (s) => s.key === e?.condition
                            )['value']
                          }
                        </Table.Cell>
                        <Table.Cell>{e.timeType}</Table.Cell>
                        <Table.Cell>{e.timeValue}</Table.Cell>
                        <Table.Cell>
                          {dayjs(e.created_at).format('YYYY-MM-DD HH:mm:ss')}
                        </Table.Cell>
                        <Table.Cell>
                          {dayjs(e.updated_at).format('YYYY-MM-DD HH:mm:ss')}
                        </Table.Cell>
                        <Table.Cell>
                          <Switch
                            onCheckedChange={(checked) => {
                              setCurrentSegmentEdit({ ...e, isActive: checked })
                              setIsUpdateStatus(true)
                            }}
                            checked={e?.isActive}
                          />
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
                                  setCurrentSegmentEdit(e);
                                  setOpenModal(true);
                                }}
                              >
                                <PencilSquare className="text-ui-fg-subtle" />
                                Edit
                              </DropdownMenu.Item>
                              <DropdownMenu.Item
                                className="gap-x-2 cursor-pointer"
                                onClick={async () => {
                                  await setCurrentSegmentEdit(e);
                                  handleDeleteSegment();
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
          </div>
        )}
      </BodyCard>
      <Spacer />

      <FocusModal
        defaultOpen={false}
        open={openModal}
        onOpenChange={setOpenModal}
      >
        <FocusModal.Content className="overflow-scroll">
          <FocusModal.Header>
            <Button onClick={handleSegmentPost}>Save</Button>
          </FocusModal.Header>
          <FocusModal.Body>
            <BodyCard
              title={`${currentSegmentEdit?.id ? 'Update' : 'Create'} Segment`}
              subtitle={`${currentSegmentEdit?.id ? 'Update' : 'Create'
                } Segment`}
            >
              <div className="flex flex-row gap-4">
                <div className="basis-10/12">
                  <Container>
                    <div className="flex flex-row gap-4">
                      <div className="basis-2/12">
                        Title
                        <span className="text-ui-fg-error">*</span>
                      </div>
                      <div className="basis-6/12">
                        <Input
                          required
                          value={currentSegmentEdit.title}
                          onChange={handleChange}
                          placeholder="Title"
                          name="title"
                        />
                      </div>
                    </div>
                    <div className="flex flex-row gap-4 mt-2">
                      <div className="basis-2/12">
                        Condition
                        <span className="text-ui-fg-error">*</span>
                      </div>
                      <div className="basis-6/12">
                        <Select
                          required
                          disabled={currentSegmentEdit.id ? true : false}
                          value={currentSegmentEdit.condition}
                          onValueChange={(val) => {
                            handleChangeWithKeyValue('condition', val);
                          }}
                          name="condition"
                        >
                          <Select.Trigger>
                            <Select.Value placeholder="Select Condition" />
                          </Select.Trigger>
                          <Select.Content className="z-50">
                            {ConditionSegmentText.map((e) => (
                              <Select.Item key={e.key} value={e.key}>
                                {e.value}
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select>
                      </div>
                    </div>
                    <div className="flex flex-row gap-4 mt-2">
                      <div className="basis-2/12">
                        Time Type
                        <span className="text-ui-fg-error">*</span>
                      </div>
                      <div className="basis-6/12">
                        <Select
                          required
                          value={currentSegmentEdit.timeType}
                          onValueChange={(val) => {
                            handleChangeWithKeyValue('timeType', val);
                          }}
                          name="timeType"
                        >
                          <Select.Trigger>
                            <Select.Value placeholder="Select Time Type" />
                          </Select.Trigger>
                          <Select.Content className="z-50">
                            {Object.values(ETimeTypeSegment).map((key) => (
                              <Select.Item key={key} value={key}>
                                {key}
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select>
                      </div>
                    </div>
                    <div className="flex flex-row gap-4 mt-2">
                      <div className="basis-2/12">
                        Time Value
                        <span className="text-ui-fg-error">*</span>
                      </div>
                      <div className="basis-6/12">
                        <Input
                          required
                          min={1}
                          max={60}
                          type="number"
                          value={currentSegmentEdit.timeValue}
                          onChange={handleChange}
                          placeholder="Time Value"
                          name="timeValue"
                        />
                      </div>
                    </div>

                    {/* <div className="flex flex-row gap-4">
                        <div className="basis-2/12">Mail To</div>
                        <div className="basis-6/12">
                          <Input
                            required
                            value={formikEditSegment.values.mailTo}
                            onChange={handleChange}
                            placeholder="To"
                            name="to"
                          />
                        </div>
                      </div> */}

                    <div className="flex flex-row gap-4 mt-2">
                      <div className="basis-2/12">
                        Email subject
                        <span className="text-ui-fg-error">*</span>
                      </div>
                      <div className="basis-6/12">
                        <Input
                          required
                          value={currentSegmentEdit.mailSubject}
                          onChange={handleChange}
                          placeholder="Email Subject"
                          name="mailSubject"
                        />
                      </div>
                    </div>
                    <div className="flex flex-row gap-4 mt-2">
                      <div className="basis-2/12">Email Heading</div>
                      <div className="basis-6/12">
                        <Input
                          value={currentSegmentEdit.mailHeading}
                          onChange={handleChange}
                          placeholder="Email Heading"
                          name="mailHeading"
                        />
                      </div>
                    </div>
                    <div className="flex flex-row gap-4 mt-2">
                      <div className="basis-2/12">Email Preheader</div>
                      <div className="basis-6/12">
                        <Input
                          value={currentSegmentEdit.mailPreheader}
                          onChange={handleChange}
                          placeholder="Email Preheader"
                          name="mailPreheader"
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
                          required
                          value={currentSegmentEdit.templateNormalId}
                          onValueChange={(val) => {
                            handleChangeWithKeyValue('templateNormalId', val);
                          }}
                          name="templateNormalId"
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
                            currentSegmentEdit.templateNormalId ? false : true
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
                          value={currentSegmentEdit.templateVipId}
                          onValueChange={(val) => {
                            handleChangeWithKeyValue('templateVipId', val);
                          }}
                          name="templateVipId"
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
                            currentSegmentEdit.templateVipId ? false : true
                          }
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
                          data={currentSegmentEdit.mailContent}
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
                            setCurrentSegmentEdit((e) => {
                              const data = Object.assign({}, e);
                              data['mailContent'] = value;
                              return data;
                            });
                          }}
                        />
                      </div>
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
    label: 'Segment',
    description: 'Setting Segment',
    icon: Tools,
  },
};

export default CustomSegment;
