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
import CustomAlert from '@/components/CustomAlert.jsx';
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
    const sectorIndex = parseInt(value);
    const selectedSectorData = mainSectors?.data?.[sectorIndex];
    setSectors(selectedSectorData?.code || []);
  };

  const handleChangeRegion = async (value) => {
    setForm({ ...form, region_id: value });
    const sectorsResponse = await getSectorsBasedOnRegion(value);
    setMainSectors(sectorsResponse);
    const sectorsTypesSelection = [];
    if (sectorsResponse?.data) {
      sectorsResponse.data.forEach((sectorItem, index) => {
        sectorsTypesSelection.push({
          id: index.toString(),
          name: sectorItem.key,
        });
      });
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
        label: 'أريد أن أشتري',
        value: 'buy',
        size: 20,
        color: '#a47764',
      },
      {
        id: 'sell',
        label: 'أريد أن أبيع',
        value: 'sell',
        size: 20,
        color: '#a47764',
      },
    ],
    []
  );

  // Confirmation alert state
  const [showConfirmAlert, setShowConfirmAlert] = useState(false);

  // Helper function to format numbers with commas
  const formatNumber = (number) => {
    if (!number) return '';
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Helper functions to get display names
  const getRegionName = () => {
    const region = regions.find(r => r.id === form.region_id);
    return region ? region.name : '';
  };

  const getSectorName = () => {
    const sector = sectors.find(s => s.id === form.sector_id);
    return sector ? sector.code : '';
  };

  const getSectorTypeName = () => {
    const sectorType = sectorsTypes.find(s => s.id === sectoreType);
    return sectorType ? sectorType.name : '';
  };

  // Generate confirmation message
  const getConfirmationMessage = () => {
    const action = currentType === 'buy' ? 'شراء' : 'بيع';
    const actionVerb = currentType === 'buy' ? 'تشتري' : 'تبيع';
    const regionName = getRegionName();
    const sectorTypeName = getSectorTypeName();
    const sectorName = getSectorName();
    const quantity = form.quantity;
    const price = form.price;
    const ownerName = form.owner_name;

    return `أنت تريد أن ${actionVerb} ${quantity} سهم في المقسم ${sectorName} من نوع ${sectorTypeName} في منطقة ${regionName} بسعر ${formatNumber(price)} ليرة سورية للسهم الواحد.`;
  };

  // Show confirmation before creating request
  const showConfirmation = () => {
    if (!form.owner_name || !form.region_id || !form.sector_id || !form.quantity || !form.price) {
      // You could show an error alert here if needed
      return;
    }
    setShowConfirmAlert(true);
  };

  const handleCreateShareRequest = async () => {
    const transactionTypeValue = currentType === 'sell' ? 1 : 2;
    const response = await createShareRequest(currentType, { ...form, transaction_type: transactionTypeValue });
    console.log(response, 'response');
    if (response?.success) {
      router.replace(`/(shares)/${response.id}`);
    }
  };

  // Confirm and create the request
  const confirmCreateRequest = async () => {
    setShowConfirmAlert(false);
    await handleCreateShareRequest();
  };

  return (
    <SafeAreaView className="flex-1">
      <CustomHeadWithBackButton title="إضافة إعلان عن أسهم تنظيمية" handleButtonPress={() => router.back()} />
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
          title={`إضافة إعلان ${currentType === 'buy' ? 'الشراء' : 'البيع'}`}
          containerStyles={'flex-grow'}
          positionOfGradient={'leftToRight'}
          textStyles={'text-white'}
          buttonStyles={'h-[45px]'}
          handleButtonPress={showConfirmation}
          loading={createShareRequestLoading}
        />
      </View>
             <CustomAlert
         visible={showConfirmAlert}
         title="تأكيد الإعلان"
         message={getConfirmationMessage()}
         onConfirm={confirmCreateRequest}
         onCancel={() => setShowConfirmAlert(false)}
       />
    </SafeAreaView>
  );
};

export default CreateShareScreen;
