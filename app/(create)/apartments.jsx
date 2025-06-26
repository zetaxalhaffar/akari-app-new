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

const CreateApartmentScreen = () => {
  const {
    getRegions,
    regionsSchema,
    getSectorsBasedOnRegion,
    sectorsBasedOnRegionSchema,
    getApartmentTypes,
    apartmentTypesSchema,
    getDirections,
    directionsSchema,
    getApartmentStatus,
    apartmentStatusSchema,
    getPaymentMethods,
    paymentMethodsSchema,
  } = useEnumsStore();

  const { createApartmentRequest, createApartmentRequestLoading } = useUnitsStore();
  const [currentType, setCurrentType] = useState('buy');
  const [form, setForm] = useState({
    owner_name: '',
    region_id: '',
    sector_id: '',
    equity: '',
    price: '',
    direction_id: '',
    payment_method_id: '',
    area: '',
    floor: '',
    rooms_count: '',
    salons_count: '',
    balcony_count: '',
    apartment_type_id: '',
    is_taras: '0',
  });

  const [regions, setRegions] = useState([]);
  const [sectorsTypes, setSectorsTypes] = useState([]);
  const [mainSectors, setMainSectors] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [apartmentTypes, setApartmentTypes] = useState([]);
  const [directions, setDirections] = useState([]);
  const [apartmentStatus, setApartmentStatus] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [fieldsToShow, setFieldsToShow] = useState([]);

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

  const getDirectionName = () => {
    const direction = directions.find(d => d.id === form.direction_id);
    return direction ? direction.name : '';
  };

  const getApartmentTypeName = () => {
    const apartmentType = apartmentTypes.find(a => a.id === form.apartment_type_id);
    return apartmentType ? apartmentType.name : '';
  };

  const getApartmentStatusName = () => {
    const status = apartmentStatus.find(s => s.id === form.apartment_status_id);
    return status ? status.name : '';
  };

  const getPaymentMethodName = () => {
    const paymentMethod = paymentMethods.find(p => p.id === form.payment_method_id);
    return paymentMethod ? paymentMethod.name : '';
  };

  // Generate confirmation message
  const getConfirmationMessage = () => {
    const actionVerb = currentType === 'buy' ? 'تشتري' : 'تبيع';
    const regionName = getRegionName();
    const sectorTypeName = getSectorTypeName();
    const sectorName = getSectorName();
    const apartmentTypeName = getApartmentTypeName();
    const paymentMethodName = getPaymentMethodName();

    let message = `أنت تريد أن ${actionVerb} عقار من نوع ${apartmentTypeName} في المقسم ${sectorName} من نوع ${sectorTypeName} في منطقة ${regionName} بسعر ${formatNumber(form.price)} ليرة سورية`;
    
    if (form.payment_method_id) {
      message += ` وطريقة الدفع ${paymentMethodName}`;
    }
    
    message += `.`;

    return message;
  };

  // Show confirmation before creating request
  const showConfirmation = () => {
    // Check required fields
    if (!form.owner_name || !form.region_id || !form.sector_id || !form.equity || 
        !form.price || !form.apartment_type_id || !form.area) {
      // You could show an error alert here if needed
      return;
    }
    setShowConfirmAlert(true);
  };

  const getEnumsList = async () => {
    const regionsResponse = await getRegions();
    const apartmentTypesResponse = await getApartmentTypes();
    const apartmentStatusResponse = await getApartmentStatus();
    const directionsResponse = await getDirections();
    const paymentMethodsResponse = await getPaymentMethods();
    setRegions(regionsResponse);
    setApartmentTypes(apartmentTypesResponse);
    setDirections(directionsResponse);
    setApartmentStatus(apartmentStatusResponse);
    setPaymentMethods(paymentMethodsResponse);
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
    getEnumsList();
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
  const tarasRadioButtons = useMemo(
    () => [
      {
        id: '1',
        label: 'يحتوي على تراس',
        value: 'true',
        size: 20,
        color: '#a47764',
      },
      {
        id: '0',
        label: 'لا يحتوي على تراس',
        value: 'false',
        size: 20,
        color: '#a47764',
      },
    ],
    []
  );

  const handleCreateApartmentRequest = async () => {
    const dataToSend = { ...form };
    const conditionalFields = ['floor', 'rooms_count', 'salons_count', 'balcony_count', 'is_taras'];

    conditionalFields.forEach(field => {
      if (!fieldsToShow.includes(field)) {
        dataToSend[field] = '';
      }
    });

    // Handle is_taras specifically based on its presence in fieldsToShow
    if (fieldsToShow.includes('is_taras')) {
        // Ensure it sends "true" or "false" as strings, matching radio button values
        dataToSend.is_taras = '1';
    } else {
        dataToSend.is_taras = '0'; // Or specific value backend expects for "not applicable"
    }

    const response = await createApartmentRequest(currentType, dataToSend);
    console.log(response, 'response');
    if (response?.success) {
      router.replace(`/(apartments)/${response.id}`);
    }
  };

  // Confirm and create the request
  const confirmCreateRequest = async () => {
    setShowConfirmAlert(false);
    await handleCreateApartmentRequest();
  };

  return (
    <SafeAreaView className="flex-1">
      <CustomHeadWithBackButton title="إضافة إعلان عن عقار" handleButtonPress={() => router.back()} />
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
          <CustomSelecteBox
            value={form.direction_id}
            setValue={(value) => setForm({ ...form, direction_id: value })}
            arrayOfValues={directions ?? []}
            disabled={directionsSchema?.loading}
            valueKey="id"
            placeholder="اتجاه العقار"
          />
        </View>
        <View className="my-4">
          <CustomSelecteBox
            value={form.apartment_type_id}
            setValue={(value) => {
              setForm({ ...form, apartment_type_id: value });
              setFieldsToShow(apartmentTypes.find((item) => item.id === value)?.fields);
            }}
            arrayOfValues={apartmentTypes ?? []}
            disabled={apartmentTypesSchema?.loading}
            valueKey="id"
            placeholder="نوع العقار"
          />
        </View>
        <View className="my-4">
          <CustomSelecteBox
            value={form.apartment_status_id}
            setValue={(value) => setForm({ ...form, apartment_status_id: value })}
            arrayOfValues={apartmentStatus ?? []}
            disabled={apartmentStatusSchema?.loading}
            valueKey="id"
            placeholder="حالة العقار"
          />
        </View>
        <View className="my-4">
          <Input
            placeholder="المساحة"
            value={form.area}
            onChangeText={(text) => setForm({ ...form, area: text })}
            type="numeric"
          />
        </View>
        {fieldsToShow.length > 0 && fieldsToShow.includes('floor') && (
          <View className="my-4">
            <Input
              placeholder="الطابق"
              value={form.floor}
              onChangeText={(text) => setForm({ ...form, floor: text })}
              type="numeric"
            />
          </View>
        )}
        {fieldsToShow.length > 0 && fieldsToShow.includes('rooms_count') && (
          <View className="my-4">
            <Input
              placeholder="عدد الغرف"
              value={form.rooms_count}
              onChangeText={(text) => setForm({ ...form, rooms_count: text })}
              type="numeric"
            />
          </View>
        )}
        {fieldsToShow.length > 0 && fieldsToShow.includes('salons_count') && (
          <View className="my-4">
            <Input
              placeholder="عدد الصالونات"
              value={form.salons_count}
              onChangeText={(text) => setForm({ ...form, salons_count: text })}
              type="numeric"
            />
          </View>
        )}
        {fieldsToShow.length > 0 && fieldsToShow.includes('balcony_count') && (
          <View className="my-4">
            <Input
              placeholder="عدد البلكونات"
              value={form.balcony_count}
              onChangeText={(text) => setForm({ ...form, balcony_count: text })}
              type="numeric"
            />
          </View>
        )}

        <View className="my-4">
          <Input
            placeholder="صاحب العلاقة"
            value={form.owner_name}
            onChangeText={(text) => setForm({ ...form, owner_name: text })}
          />
        </View>
        <View className="my-4">
          <Input
            placeholder={`عدد الأسهم المتاحة (${currentType === 'buy' ? 'المطلوبة' : 'المعروضة'})`}
            value={form.equity}
            type="numeric"
            onChangeText={(text) => setForm({ ...form, equity: text })}
          />
        </View>
        <View className="my-4">
          <Input
            placeholder="سعر العقار (ليرة سورية)"
            value={form.price}
            type="numeric"
            onChangeText={(text) => setForm({ ...form, price: text })}
          />
        </View>
        <View className="my-4">
          <CustomSelecteBox
            value={form.payment_method_id}
            setValue={(value) => setForm({ ...form, payment_method_id: value })}
            arrayOfValues={paymentMethods ?? []}
            disabled={paymentMethodsSchema?.loading}
            valueKey="id"
            placeholder="طريقة الدفع"
          />
        </View>
        {fieldsToShow.length > 0 && fieldsToShow.includes('is_taras') && (
          <View className="my-4">
            <CustomRadioButtons
              radioButtons={tarasRadioButtons}
              handleChangeRadioButton={(value) => setForm({ ...form, is_taras: value })}
              selectedId={form.is_taras}
            />
          </View>
        )}
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
          loading={createApartmentRequestLoading}
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

export default CreateApartmentScreen;
