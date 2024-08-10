import type { SettingConfig } from '@medusajs/admin';
import { CreditCard } from '@medusajs/icons';
import BackButton from '../../components/shared/back-button';
import BodyCard from '../../components/shared/body-card';
import Spacer from '../../components/shared/spacer';
import { PaymentSetting } from '../../../models/payment-setting';
import { useAdminCustomQuery, useAdminCustomPost } from 'medusa-react';
import { Table, Input, Select, Toaster, useToast, Badge } from '@medusajs/ui';
import Spinner from '../../components/shared/spinner';
import { useState, useMemo } from 'react';
import EditIcon from '../../components/shared/icons/edit-icon';
import { Check } from '@medusajs/icons';
import { EPaymentSettingType } from '../../constants/enum';

export type PaymentSettingGetRes = {
  data: PaymentSetting[];
};

export type PaymentUpdateSettingPostRes = {
  data: boolean;
};

const CustomSettingPayments = () => {
  const { toast } = useToast();
  const [currentPaymentEdit, setCurrentPaymentEdit] = useState<any>();

  const {
    data: dataPaymentSettings,
    isLoading,
    refetch,
  } = useAdminCustomQuery<undefined, PaymentSettingGetRes>(
    '/payment-setting',
    []
  );

  const { mutate, isLoading: isLoadingUpdate } = useAdminCustomPost<
    any,
    PaymentUpdateSettingPostRes
  >(`/payment-setting/update/${currentPaymentEdit?.id}`, []);

  const paymentSettings = useMemo(() => {
    return (
      dataPaymentSettings?.data.map((e) => ({
        id: e.id,
        type: e.type,
        public_key: e.public_key || '',
        secret_key: e.secret_key || '',
        webhook_id: e.webhook_id || '',
        is_sanbox: e.is_sanbox,
      })) || []
    );
  }, [dataPaymentSettings]);

  const columns = [
    {
      title: '#',
      key: '#',
    },
    {
      title: 'Type',
      key: 'type',
    },
    {
      title: 'Public Key',
      key: 'public_key',
    },
    {
      title: 'Secret Key',
      key: 'secret_key',
    },
    {
      title: 'Webhook Id',
      key: 'webhook_id',
    },
    {
      title: 'Is Sanbox',
      key: 'is_sanbox',
    },
    {
      title: 'Action',
      key: 'action',
    },
  ];

  const handleUpdateSettingPayment = () => {
    const data = Object.assign({}, currentPaymentEdit);
    delete data.id;
    mutate(data, {
      onSuccess: (res) => {
        refetch();
        toast({
          title: 'Update Successful',
          description: 'Update Payment Successful',
          variant: 'success',
          duration: 1500,
        });
      },
    });
    setCurrentPaymentEdit(undefined);
  };

  const handleChange = (event) => {
    setCurrentPaymentEdit((e) => {
      const data = Object.assign({}, e);
      if (event.target.name !== 'is_sanbox') {
        data[event.target.name] = event.target.value;
      }

      return data;
    });
  };

  const handleChangeIsSanbox = (value) => {
    setCurrentPaymentEdit((e) => {
      const data = Object.assign({}, e);
      data['is_sanbox'] = value === 'true';
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

      <BodyCard title="Setting Payments" subtitle="Setting Payments">
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
              {paymentSettings.map((e, index) => {
                return e.id === currentPaymentEdit?.id ? (
                  <Table.Row key={index}>
                    <Table.Cell>{index + 1}</Table.Cell>
                    <Table.Cell>
                      {currentPaymentEdit.type.toLocaleUpperCase()}
                    </Table.Cell>
                    <Table.Cell>
                      <Input
                        value={currentPaymentEdit.public_key}
                        onChange={handleChange}
                        name="public_key"
                        placeholder="Public Key"
                        size="small"
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <Input
                        value={currentPaymentEdit.secret_key}
                        onChange={handleChange}
                        placeholder="Secret Key"
                        name="secret_key"
                        size="small"
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <Input
                        value={currentPaymentEdit.webhook_id}
                        onChange={handleChange}
                        placeholder="Webhook Id"
                        name="webhook_id"
                        size="small"
                      />
                    </Table.Cell>
                    <Table.Cell>
                      {currentPaymentEdit.type ===
                      EPaymentSettingType.PAYPAL ? (
                        <Select
                          value={currentPaymentEdit.is_sanbox.toString()}
                          onValueChange={handleChangeIsSanbox}
                          name="is_sanbox"
                          size="small"
                        >
                          <Select.Trigger>
                            <Select.Value placeholder="Select Type Sanbox" />
                          </Select.Trigger>
                          <Select.Content>
                            <Select.Item value="false">
                              <Badge>Deactive</Badge>
                            </Select.Item>
                            <Select.Item value="true">
                              <Badge color="green">Active</Badge>
                            </Select.Item>
                          </Select.Content>
                        </Select>
                      ) : (
                        ''
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      <Check
                        cursor={'pointer'}
                        onClick={handleUpdateSettingPayment}
                      />
                    </Table.Cell>
                  </Table.Row>
                ) : (
                  <Table.Row key={index}>
                    <Table.Cell>{index + 1}</Table.Cell>
                    <Table.Cell>{e.type.toLocaleUpperCase()}</Table.Cell>
                    <Table.Cell>{e.public_key}</Table.Cell>
                    <Table.Cell>{e.secret_key}</Table.Cell>
                    <Table.Cell>{e.webhook_id}</Table.Cell>
                    <Table.Cell>
                      {(() => {
                        if (e.type === EPaymentSettingType.PAYPAL) {
                          return e.is_sanbox ? (
                            <Badge color="green">Active</Badge>
                          ) : (
                            <Badge>Deactive</Badge>
                          );
                        }
                      })()}
                    </Table.Cell>
                    <Table.Cell>
                      <EditIcon
                        cursor={'pointer'}
                        size={20}
                        onClick={() => setCurrentPaymentEdit(e)}
                      />
                    </Table.Cell>
                  </Table.Row>
                );
              })}
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
    label: 'Payments',
    description: 'Setting Payments',
    icon: CreditCard,
  },
};

export default CustomSettingPayments;
