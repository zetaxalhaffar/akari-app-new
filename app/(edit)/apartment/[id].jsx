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
const EditApartmentScreen = () => {
  // Get the id from the url
  const { id } = useGlobalSearchParams();

  const {
    getRegions,
    getSectorsBasedOnRegion,
    sectorsBasedOnRegionSchema,
    getApartmentTypes,
    apartmentTypesSchema,
    getDirections,
    directionsSchema,
    getApartmentStatus,
    apartmentStatusSchema,
  } = useEnumsStore();

  const {
    createApartmentRequest,
    createApartmentRequestLoading,
    getApartmentDetails,
    apartmentDetailsLoading,
  } = useUnitsStore();
  const [currentType, setCurrentType] = useState('buy');
  const [form, setForm] = useState({
    owner_name: '',
    region_id: '',
    sector_id: '',
    equity: '',
    price: '',
    direction_id: '',
    area: '',
    floor: '',
    rooms_count: '',
    salons_count: '',
    balcony_count: '',
    apartment_type_id: '',
  });

  const [regions, setRegions] = useState([]);
  const [sectorsTypes, setSectorsTypes] = useState([]);
  const [mainSectors, setMainSectors] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [apartmentTypes, setApartmentTypes] = useState([]);
  const [directions, setDirections] = useState([]);
  const [apartmentStatus, setApartmentStatus] = useState([]);
  const [fieldsToShow, setFieldsToShow] = useState([]);
  const getEnumsList = async () => {
    try {
      const [regionsResponse, apartmentTypesResponse, directionsResponse, apartmentStatusResponse] =
        await Promise.all([
          getRegions(),
          getApartmentTypes(),
          getDirections(),
          getApartmentStatus(),
        ]);
      setRegions(regionsResponse);
      setApartmentTypes(apartmentTypesResponse);
      setDirections(directionsResponse);
      setApartmentStatus(apartmentStatusResponse);
    } catch (error) {
      console.error('Error fetching enums:', error);
    }
  };

  const [sectoreType, setSectoreType] = useState('');
  const mainSectorsRef = useRef([]);

  const handleSelectSectorType = async (value) => {
    setSectoreType(value);
    setSectors(mainSectorsRef.current[value]?.code);
  };

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

  const handleChangeApartmentType = async (value) => {
    setForm({ ...form, apartment_type_id: value });
  };

  const handleCreateApartmentRequest = async () => {
    const response = await createApartmentRequest(currentType, form);
    console.log(response, 'response');
    if (response?.success) {
      router.replace(`/apartment/${id}`);
      router.dismissAll();
    }
  };

  const getApartmentDetailsHandler = async () => {
    if (!id) return;
    const response = await getApartmentDetails(id);
    const sectorsTypesSelection = await handleChangeRegion(response.region_id);
    setCurrentType(response.transaction_type);
    const sectorType = sectorsTypesSelection.find((item) => item.name == response.sector.code.name);
    console.log(sectorType, 'sectorType');
    if (sectorType) {
      await handleSelectSectorType(sectorType.id);
      setForm({ ...form, sector_id: response.sector_id });
    }
    await handleChangeApartmentType(response.apartment_type_id);
    setFieldsToShow(response.apartment_type.fields ?? []);
    setForm({
      owner_name: response.owner_name,
      region_id: response.region_id,
      sector_id: response.sector_id,
      equity: String(response.equity_key),
      price: String(response.price_key),
      direction_id: response.direction_id,
      area: String(response.area),
      floor: String(response.floor),
      rooms_count: String(response.rooms_count),
      salons_count: String(response.salons_count),
      balcony_count: String(response.balcony_count),
      apartment_type_id: response.apartment_type_id,
      is_taras: String(response.is_taras),
      apartment_status_id: response.apartment_status_id,
    });
  };
  useEffect(() => {
    getEnumsList();
  }, []);

  useEffect(() => {
    getApartmentDetailsHandler();
  }, [id]);

  return (
    <SafeAreaView className="flex-1">
      {apartmentDetailsLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="100" color="#a47764" />
        </View>
      ) : (
        <>
          <CustomHeadWithBackButton title="تعديل العقار" handleButtonPress={() => router.back()} />
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
                setValue={handleChangeApartmentType}
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
              title={`تعديل طلب ${currentType === 'buy' ? 'الشراء' : 'البيع'}`}
              containerStyles={'flex-grow'}
              positionOfGradient={'leftToRight'}
              textStyles={'text-white'}
              buttonStyles={'h-[45px]'}
              handleButtonPress={handleCreateApartmentRequest}
              loading={createApartmentRequestLoading}
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default EditApartmentScreen;
