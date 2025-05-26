import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from '@/components/CustomInput';
import CustomRadioButtons from '@/components/CustomRadioButtons';
import CustomHeadWithBackButton from '@/components/CustomHeadWithBackButton';
import CustomSelecteBox from '@/components/CustomSelecteBox.jsx';
import { router, useGlobalSearchParams } from 'expo-router';
import { useEnumsStore } from '@/store/enums.store';
import CustomButton from '@/components/CustomButton.jsx';
import { useUnitsStore } from '@/store/units.store';

const EditShare = () => {
  // Get the id from the url
  const { id } = useGlobalSearchParams();

  const { getRegions, getSectorsBasedOnRegion, sectorsBasedOnRegionSchema } = useEnumsStore();

  const { updateShareRequest, updateShareRequestLoading, getShareDetails, shareDetailsLoading } =
    useUnitsStore();
  const [currentType, setCurrentType] = useState('buy');
  const [form, setForm] = useState({
    owner_name: '',
    region_id: '',
    sector_id: '',
    quantity: '',
    price: '',
  });

  const [regions, setRegions] = useState([]);
  const [sectorsTypes, setSectorsTypes] = useState([]);
  const [mainSectors, setMainSectors] = useState([]);
  const [sectors, setSectors] = useState([]);
  const getRegionsList = async () => {
    const response = await getRegions();
    setRegions(response);
  };

  const [sectoreType, setSectoreType] = useState('');

  const handleSelectSectorType = async (value) => {
    setSectoreType(value);
    setSectors(mainSectorsRef.current[value]?.code);
  };

  const mainSectorsRef = useRef([]);

  const handleChangeRegion = async (value) => {
    setForm({ ...form, region_id: value });
    const sectorsResponse = await getSectorsBasedOnRegion(value);
    mainSectorsRef.current = sectorsResponse;
    setMainSectors(sectorsResponse);
    const sectorsTypesSelection = [];

    for (let sector in sectorsResponse) {
      if (sectorsResponse[sector] !== true) {
        sectorsTypesSelection.push({
          id: sector,
          name: sectorsResponse[sector]?.key,
        });
      }
    }
    setSectorsTypes(sectorsTypesSelection);
    return sectorsTypesSelection;
  };
  // Fetch regions on mount
  useEffect(() => {
    getRegionsList();
  }, []);

  const getShareDetailsHandler = async () => {
    if (!id) return;
    const response = await getShareDetails(id);
    const sectorsTypesSelection = await handleChangeRegion(response.region_id);
    setCurrentType(response.transaction_type);
    const sectorType = sectorsTypesSelection.find((item) => item.name == response.sector.code.name);
    if (sectorType) {
      await handleSelectSectorType(sectorType.id); // Wait for sector data to update
    }
    setForm({
      region_id: response.region_id,
      sector_id: response.sector_id,
      owner_name: response.owner_name,
      price: response.price_key,
      quantity: response.quantity_key,
    });
  };

  useEffect(() => {
    getShareDetailsHandler();
  }, [id]);

  const radioButtons = useMemo(
    () => [
      {
        id: 'buy',
        label: 'طلب شراء',
        value: 'buy',
        size: 20,
        color: '#a47764',
      },
      {
        id: 'sell',
        label: 'عرض بيع',
        value: 'sell',
        size: 20,
        color: '#a47764',
      },
    ],
    []
  );

  const handleUpdateShareRequest = async () => {
    const response = await updateShareRequest(id, form);
    if (response?.success) {
      router.replace(`/(shares)/${id}`);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      {shareDetailsLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="100" color="#a47764" />
        </View>
      ) : (
        <>
          <CustomHeadWithBackButton
            title="تعديل سهم تنظيمي"
            handleButtonPress={() => router.back()}
          />
          <ScrollView className="flex-1 px-4">
            <CustomRadioButtons
              radioButtons={radioButtons}
              handleChangeRadioButton={(value) => setCurrentType(value)}
              selectedId={currentType}
            />
            <View className="my-4">
              <CustomSelecteBox
                value={form.region_id}
                setValue={handleChangeRegion}
                arrayOfValues={regions}
                valueKey="id"
                placeholder=" المنطقة"
              />
            </View>
            <View className="my-4">
              <CustomSelecteBox
                value={sectoreType}
                setValue={handleSelectSectorType}
                arrayOfValues={sectorsTypes}
                disabled={sectorsBasedOnRegionSchema?.loading}
                valueKey="id"
                emptyMessage="يرجى اختيار المنطقة أولا"
                placeholder="نوع المقسم"
              />
            </View>
            <View className="my-4">
              <CustomSelecteBox
                value={form.sector_id}
                setValue={(value) => setForm({ ...form, sector_id: value })}
                arrayOfValues={sectors ?? []}
                disabled={sectorsBasedOnRegionSchema?.loading}
                valueKey="id"
                emptyMessage="يرجى اختيار نوع المقسم أولا"
                placeholder=" المقسم"
                keyName="code"
              />
            </View>
            <View className="my-4">
              <Input
                placeholder="صاحب العلاقة"
                value={form.owner_name}
                onChangeText={(text) => setForm({ ...form, owner_name: text })}
              />
            </View>
            <View className="my-4">
              <Input
                placeholder={`عدد الأسهم (${currentType === 'buy' ? 'المطلوبة' : 'المعروضة'})`}
                value={form.quantity}
                type="numeric"
                onChangeText={(text) => setForm({ ...form, quantity: text })}
              />
            </View>
            <View className="my-4">
              <Input
                placeholder="سعر السهم الواحد (ليرة سورية)"
                value={form.price}
                type="numeric"
                onChangeText={(text) => setForm({ ...form, price: text })}
              />
            </View>
          </ScrollView>
          <View className="p-4">
            <CustomButton
              hasGradient={true}
              colors={['#633e3d', '#774b46', '#8d5e52', '#a47764', '#bda28c']}
              title={`تعديل طلب ${currentType === 'buy' ? 'الشراء' : 'البيع'}`}
              containerStyles={'flex-grow'}
              positionOfGradient={'leftToRight'}
              textStyles={'text-white'}
              buttonStyles={'h-[45px]'}
              handleButtonPress={handleUpdateShareRequest}
              loading={updateShareRequestLoading}
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default EditShare;
