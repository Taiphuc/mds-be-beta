import type { SettingConfig } from '@medusajs/admin';
import { Phone } from '@medusajs/icons';
import BackButton from '../../components/shared/back-button';
import BodyCard from '../../components/shared/body-card';
import Spacer from '../../components/shared/spacer';
import { SmsSetting } from '../../../models/sms-setting';
import { useAdminCustomQuery, useAdminCustomPost } from 'medusa-react';
import { Table, Input, Toaster, useToast } from '@medusajs/ui';
import Spinner from '../../components/shared/spinner';
import { useState, useMemo } from 'react';
import EditIcon from '../../components/shared/icons/edit-icon';
import { Check } from '@medusajs/icons';

export type SmsSettingGetRes = {
  data: SmsSetting;
};

export type SmsSettingUpdatePostRes = {
  data: boolean;
};

const CustomSmsSetting = () => {
  const { toast } = useToast();
  const [currentSmsSettingEdit, setCurrentSmsSettingEdit] = useState<any>();

  const {
    data: dataSms,
    isLoading,
    refetch,
  } = useAdminCustomQuery<undefined, SmsSettingGetRes>('/sms-setting', []);

  const { mutate, isLoading: isLoadingUpdate } = useAdminCustomPost<
    any,
    SmsSettingUpdatePostRes
  >(`/sms-setting/update/${currentSmsSettingEdit?.id}`, []);

  const sms = useMemo(() => {
    return {
      id: dataSms?.data.id,
      account_sid: dataSms?.data.account_sid || '',
      auth_token: dataSms?.data.auth_token || '',
      from_number: dataSms?.data.from_number || '',
    };
  }, [dataSms]);

  const columns = [
    {
      title: '#',
      key: '#',
    },
    {
      title: 'Account SID',
      key: 'account_sid',
    },
    {
      title: 'Auth Token',
      key: 'auth_token',
    },
    {
      title: 'From Number',
      key: 'from_number',
    },
    {
      title: 'Action',
      key: 'action',
    },
  ];

  const handleUpdateSms = () => {
    const data = Object.assign({}, currentSmsSettingEdit);
    delete data.id;
    mutate(data, {
      onSuccess: (res) => {
        refetch();
        toast({
          title: 'Update Successful',
          description: 'Update Sms Successful',
          variant: 'success',
          duration: 1500,
        });
      },
    });
    setCurrentSmsSettingEdit(undefined);
  };

  const handleChange = (event) => {
    setCurrentSmsSettingEdit((e) => {
      const data = Object.assign({}, e);
      data[event.target.name] = event.target.value;
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

      <BodyCard title="Setting SMS Twilio" subtitle="Setting SMS Twilio">
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
              {currentSmsSettingEdit?.id ? (
                <Table.Row>
                  <Table.Cell>1</Table.Cell>
                  <Table.Cell>
                    <Input
                      value={currentSmsSettingEdit.account_sid}
                      onChange={handleChange}
                      name="account_sid"
                      placeholder="Account SID"
                      size="small"
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <Input
                      value={currentSmsSettingEdit.auth_token}
                      onChange={handleChange}
                      placeholder="Auth Token"
                      name="auth_token"
                      size="small"
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <Input
                      value={currentSmsSettingEdit.from_number}
                      onChange={handleChange}
                      placeholder="From Number"
                      name="from_number"
                      size="small"
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <Check cursor={'pointer'} onClick={handleUpdateSms} />
                  </Table.Cell>
                </Table.Row>
              ) : (
                <Table.Row>
                  <Table.Cell>1</Table.Cell>
                  <Table.Cell>{sms.account_sid}</Table.Cell>
                  <Table.Cell>{sms.auth_token}</Table.Cell>
                  <Table.Cell>{sms.from_number}</Table.Cell>
                  <Table.Cell>
                    <EditIcon
                      cursor={'pointer'}
                      size={20}
                      onClick={() => setCurrentSmsSettingEdit(sms)}
                    />
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        )}
      </BodyCard>
      <Spacer />
    </div>
  );
};

export const config: SettingConfig = {
  card: {
    label: 'SMS Twilio',
    description: 'Setting SMS Twilio',
    icon: Phone,
  },
};

export default CustomSmsSetting;
