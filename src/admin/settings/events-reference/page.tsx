import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
  Badge,
  Button,
  FocusModal,
  Heading,
  Input,
  Select,
  Table,
  Toaster,
  useToast
} from '@medusajs/ui';
import { useAdminCustomPost, useAdminCustomQuery } from 'medusa-react';
import { Pagination } from 'nestjs-typeorm-paginate';
import { useEffect, useMemo, useState } from 'react';
import BackButton from '../../components/shared/back-button';
import BodyCard from '../../components/shared/body-card';
import { Container } from '../../components/shared/container';
import EditIcon from '../../components/shared/icons/edit-icon';
import Spacer from '../../components/shared/spacer';
import Spinner from '../../components/shared/spinner';
import { PaginationDefault } from '../../constants/constant';
import PaginationTable from '../../types/pagination-table';

export type EventsReferenceGetQuery = {
  limit: number;
  page: number;
  action?: string;
};

export type EventsReferenceGetRes = {
  data: Pagination<any>;
};

export type EventsReferenceUpdateStateRes = {
  data: boolean;
};

const CustomEventsReference = () => {
  const { toast } = useToast();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [currentEventsReferenceEdit, setCurrentEventsReferenceEdit] =
    useState<any>();
  const [pagination, setPagination] =
    useState<PaginationTable>(PaginationDefault);

  const {
    data: dataEventsReferences,
    isLoading,
    refetch,
  } = useAdminCustomQuery<EventsReferenceGetQuery, EventsReferenceGetRes>(
    '/events-reference',
    [],
    {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
    }
  );

  const { mutate, isLoading: isLoadingUpdate } = useAdminCustomPost<
    any,
    EventsReferenceUpdateStateRes
  >(`/events-reference/update/${currentEventsReferenceEdit?.id}`, []);

  const eventsReferences = useMemo(() => {
    const meta = dataEventsReferences?.data.meta;

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
      dataEventsReferences?.data.items.map((e) => ({
        id: e.id,
        action: e.action,
        subject: e.subject || '',
        template_normal: e.template_normal || '',
        template_vip: e.template_vip || '',
        is_active: e.is_active,
      })) || []
    );
  }, [dataEventsReferences]);

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
      title: 'Action',
      key: 'action',
    },
    {
      title: 'Subject',
      key: 'subject',
    },
    {
      title: 'Template Normal',
      key: 'template_normal',
    },
    {
      title: 'Template Vip',
      key: 'template_vip',
    },
    {
      title: 'Is Active',
      key: 'is_active',
    },
    {
      title: 'Action Handle',
      key: 'action_handle',
    },
  ];

  const handleUpdateEventsReference = () => {
    const data = Object.assign({}, currentEventsReferenceEdit);
    delete data.id;
    mutate(data, {
      onSuccess: (res) => {
        refetch();
        toast({
          title: 'Update Successful',
          description: 'Update Events Reference Successful',
          variant: 'success',
          duration: 1500,
        });
      },
    });
    setCurrentEventsReferenceEdit({});
    setOpenModal(false);
  };

  const handleChange = (event) => {
    setCurrentEventsReferenceEdit((e) => {
      const data = Object.assign({}, e);
      if (event.target.name !== 'is_active') {
        data[event.target.name] = event.target.value;
      }
      return data;
    });
  };

  const handleChangeIsActive = (value) => {
    setCurrentEventsReferenceEdit((e) => {
      const data = Object.assign({}, e);
      data['is_active'] = value === 'true';
      return data;
    });
  };

  const handleChangeEditor = (key, value) => {
    setCurrentEventsReferenceEdit((e) => {
      const data = Object.assign({}, e);
      data[key] = value;
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

  return (
    <div>
      <BackButton
        label="Back to settings"
        path="/a/settings"
        className="mb-xsmall"
      />
      <BodyCard title="Events Reference" subtitle="Events Reference">
        <Toaster />
        {isLoading || isLoadingUpdate ? (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white bg-opacity-50">
            <Spinner variant="secondary" />
          </div>
        ) : (
          <Table>
            <Table.Header>
              <Table.Row>
                {columns.map((e) => (
                  <Table.HeaderCell key={e.key}>{e.title}</Table.HeaderCell>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {eventsReferences.map((e, index) => {
                return (
                  <Table.Row key={index}>
                    <Table.Cell>
                      {pagination.pageIndex * pagination.pageSize + index + 1}
                    </Table.Cell>
                    <Table.Cell>{e.action.toLocaleUpperCase()}</Table.Cell>
                    <Table.Cell>{e.subject}</Table.Cell>
                    <Table.Cell>
                      {e.template_normal ? (
                        <Badge color="green">Configured</Badge>
                      ) : (
                        <Badge>Need Config</Badge>
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      {e.template_vip ? (
                        <Badge color="green">Configured</Badge>
                      ) : (
                        <Badge>Need Config</Badge>
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      {e.is_active ? (
                        <Badge color="green">Active</Badge>
                      ) : (
                        <Badge>Deactive</Badge>
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      <EditIcon
                        cursor={'pointer'}
                        size={20}
                        onClick={() => {
                          setCurrentEventsReferenceEdit(e);
                          setOpenModal(true);
                        }}
                      />
                    </Table.Cell>
                  </Table.Row>
                );
              })}
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
            </Table.Body>
          </Table>
        )}
      </BodyCard>
      <Spacer />

      <FocusModal
        defaultOpen={false}
        open={openModal}
        onOpenChange={setOpenModal}
      >
        <FocusModal.Content>
          <FocusModal.Header>
            <Button onClick={handleUpdateEventsReference}>Save</Button>
          </FocusModal.Header>
          <FocusModal.Body>
            <BodyCard
              title="Update Events Reference"
              subtitle="Update Events Reference"
            >
              <div className="flex flex-row gap-4">
                <div className="basis-1/6">
                  <Container>
                    <Heading level="h2">Subject</Heading>
                    <div className="h-10">
                      <Input
                        value={currentEventsReferenceEdit?.subject}
                        onChange={handleChange}
                        placeholder="Subject"
                        name="subject"
                        size="base"
                      />
                    </div>
                  </Container>
                </div>
                <div className="basis-1/6">
                  <Container>
                    <Heading level="h2">Is Active</Heading>
                    <div className="h-10">
                      <Select
                        value={currentEventsReferenceEdit?.is_active?.toString()}
                        onValueChange={handleChangeIsActive}
                        name="is_active"
                      >
                        <Select.Trigger>
                          <Select.Value placeholder="Select Active" />
                        </Select.Trigger>
                        <Select.Content className="z-50">
                          <Select.Item value="false">Deactive</Select.Item>
                          <Select.Item value="true">Active</Select.Item>
                        </Select.Content>
                      </Select>
                    </div>
                  </Container>
                </div>
              </div>

              <div className="flex flex-row gap-4">
                <div className="basis-1/2">
                  <Container>
                    <Heading level="h2">Template Normal</Heading>
                    <div>
                      <CKEditor
                        editor={ClassicEditor}
                        data={currentEventsReferenceEdit?.template_normal || ''}
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
                          const data = editor.getData();
                          handleChangeEditor('template_normal', data);
                        }}
                      />
                    </div>
                  </Container>
                </div>
                <div className="basis-1/2">
                  <Container>
                    <Heading level="h2">Template Vip</Heading>
                    <div>
                      <CKEditor
                        editor={ClassicEditor}
                        data={currentEventsReferenceEdit?.template_vip || ''}
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
                          const data = editor.getData();
                          handleChangeEditor('template_vip', data);
                        }}
                      />
                    </div>
                  </Container>
                </div>
              </div>
            </BodyCard>
          </FocusModal.Body>
        </FocusModal.Content>
      </FocusModal>
    </div>
  );
};

// export const config: SettingConfig = {
//   card: {
//     label: 'Events Reference',
//     description: 'Setting Events Reference',
//     icon: Sparkles,
//   },
// };

export default CustomEventsReference;
