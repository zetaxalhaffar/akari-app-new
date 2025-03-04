import { View, Text, ScrollView } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from '@/components/CustomInput';
import CustomRadioButtons from '../../components/CustomRadioButtons';
import CustomHeadWithBackButton from '../../components/CustomHeadWithBackButton';
import CustomSelecteBox from '@/components/CustomSelecteBox.jsx';
import { router } from 'expo-router';
import { useEnumsStore } from '../../store/enums.store';
import CustomButton from '@/components/CustomButton.jsx';
import { useUnitsStore } from '../../store/units.store';

const CreateShareScreen = () => {
  const { getRegions, regionsSchema, getSectorsBasedOnRegion, sectorsBasedOnRegionSchema } =
    useEnumsStore();

  const { createShareRequest, createShareRequestLoading } = useUnitsStore();
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
    setSectors(mainSectors[value]?.code);
  };

  const handleChangeRegion = async (value) => {
    setForm({ ...form, region_id: value });
    const sectorsResponse = await getSectorsBasedOnRegion(value);
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
  };
  // Fetch regions on mount
  useEffect(() => {
    getRegionsList();
  }, []);

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

  const handleCreateShareRequest = async () => {
    const response = await createShareRequest(currentType, form);
    console.log(response, 'response');
    if (response?.success) {
      router.replace(`/(shares)/${response.id}`);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <CustomHeadWithBackButton title="إضافة سهم تنظيمي" handleButtonPress={() => router.back()} />
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
          title={`إضافة طلب ${currentType === 'buy' ? 'الشراء' : 'البيع'}`}
          containerStyles={'flex-grow'}
          positionOfGradient={'leftToRight'}
          textStyles={'text-white'}
          buttonStyles={'h-[45px]'}
          handleButtonPress={handleCreateShareRequest}
          loading={createShareRequestLoading}
        />
      </View>
    </SafeAreaView>
  );
};

export default CreateShareScreen;
