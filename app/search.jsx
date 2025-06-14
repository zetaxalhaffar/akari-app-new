// app/SearchScreen.jsx
import { View, Text, ScrollView, I18nManager } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import CustomHeadWithBackButton from '../components/CustomHeadWithBackButton';
import { Input } from '@/components/CustomInput';
import CustomRadioButtons from '../components/CustomRadioButtons';
import CustomSelecteBox from '@/components/CustomSelecteBox.jsx';
import { useEnumsStore } from '../store/enums.store';
import CustomButton from '@/components/CustomButton.jsx';

const price_operator = [
  { name: 'مساوي', id: '=' },
  { name: 'أكبر', id: '>' },
  { name: 'أصغر', id: '<' },
  { name: 'أكبر أو مساوي', id: '>=' },
  { name: 'أصغر أو مساوي', id: '<=' },
];

const SearchScreen = () => {
  const {
    getRegions,
    regions,
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

  const [form, setForm] = useState({
    id: '',
    region_id: '',
    sector_id: '',
    price_operator: '=',
    price: '',
    owner_name: '',
    apartment_type_id: '',
    direction_id: '',
    apartment_status_id: '',
    payment_method_id: '',
    area: '',
    floor: '',
    rooms_count: '',
    salons_count: '',
    balcony_count: '',
    is_taras: '0',
  });
  const [currentType, setCurrentType] = useState('share');
  const [sectoreType, setSectoreType] = useState('');
  const [sectorsTypes, setSectorsTypes] = useState([]);
  const [mainSectors, setMainSectors] = useState([]);
  const [sectors, setSectors] = useState([]);

  const [apartmentTypesList, setApartmentTypesList] = useState([]);
  const [directionsList, setDirectionsList] = useState([]);
  const [apartmentStatusList, setApartmentStatusList] = useState([]);
  const [paymentMethodsList, setPaymentMethodsList] = useState([]);
  const [fieldsToShowForApartment, setFieldsToShowForApartment] = useState([]);

  const unitTypeRadioButtons = useMemo(
    () => [
      { id: 'share', label: 'أسهم تنظيمية', value: 'share', size: 20, color: '#a47764' },
      { id: 'apartment', label: 'عقارات', value: 'apartment', size: 20, color: '#a47764' },
    ],
    [form?.id]
  );

  const handleChangeRegion = async (value) => {
    setForm({ ...form, region_id: value, sector_id: '', apartment_type_id: '', direction_id: '', apartment_status_id: '', payment_method_id: '', area: '', floor: '', rooms_count: '', salons_count: '', balcony_count: '', is_taras: '0' });
    setSectoreType('');
    setSectors([]);
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

  const handleSelectSectorType = async (value) => {
    setSectoreType(value);
    const sectorIndex = parseInt(value);
    const selectedSectorData = mainSectors?.data?.[sectorIndex];
    setSectors(selectedSectorData?.code || []);
    setForm({ ...form, sector_id: '' });
  };

  const getEnums = async () => {
    await getRegions();
    const aptTypes = await getApartmentTypes();
    const dirs = await getDirections();
    const aptStatus = await getApartmentStatus();
    const paymentMethods = await getPaymentMethods();
    setApartmentTypesList(aptTypes || []);
    setDirectionsList(dirs || []);
    setApartmentStatusList(aptStatus || []);
    setPaymentMethodsList(paymentMethods || []);
  };

  const handleSearch = async () => {
    const paramsToPush = { ...form, sectoreType, currentType };
    console.log('Pushing to SearchResults with params:', JSON.stringify(paramsToPush, null, 2));
    router.push({
      pathname: '/SearchResults',
      params: paramsToPush,
    });
  };

  useEffect(() => {
    getEnums();
  }, []);

  const tarasRadioButtons = useMemo(
    () => [
      { id: '1', label: 'نعم', value: '1', size: 20, color: '#a47764' },
      { id: '0', label: 'لا', value: '0', size: 20, color: '#a47764' },
    ],
    []
  );
  
  const handleApartmentTypeChange = (value) => {
    setForm({ ...form, apartment_type_id: value });
    const selectedType = apartmentTypesList.find((item) => item.id === value);
    setFieldsToShowForApartment(selectedType?.fields || []);
  };
  
  const handleUnitTypeChange = (value) => {
    setCurrentType(value);
    setForm({
      id: '',
      region_id: '',
      sector_id: '',
      price_operator: '=',
      price: '',
      owner_name: '',
      apartment_type_id: '',
      direction_id: '',
      apartment_status_id: '',
      payment_method_id: '',
      area: '',
      floor: '',
      rooms_count: '',
      salons_count: '',
      balcony_count: '',
      is_taras: '0',
    });
    setSectoreType('');
    setSectorsTypes([]);
    setMainSectors([]);
    setSectors([]);
    setFieldsToShowForApartment([]);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <CustomHeadWithBackButton
        title="البحث عن وحدة"
        handleButtonPress={() => router.back()}
        rightText={''}
        rightIcon={<Feather name="search" size={20} color="#a47764" />}
        rightIconPress={() => router.push({ pathname: '/search' })}
      />
      <View className="flex-1 px-4">
        <ScrollView>
          <View>
            <Text className="mb-2 font-pmedium text-gray-700">نوع الوحدة</Text>
            <CustomRadioButtons
              radioButtons={unitTypeRadioButtons}
              handleChangeRadioButton={handleUnitTypeChange}
              selectedId={currentType}
              disabled={form.id.length > 0}
            />
          </View>
          <View>
            <Input
              placeholder="الرقم المرجعي"
              value={form.id}
              onChangeText={(value) => setForm({ ...form, id: value })}
              type="numeric"
            />
          </View>
          <View className="my-4">
            <CustomSelecteBox
              value={form.region_id}
              setValue={handleChangeRegion}
              arrayOfValues={regions}
              valueKey="id"
              placeholder=" المنطقة"
              disabled={form.id.length > 0}
              hideLoading={true}
            />
          </View>
          <View className="my-4">
            <CustomSelecteBox
              value={sectoreType}
              setValue={handleSelectSectorType}
              arrayOfValues={sectorsTypes}
              valueKey="id"
              emptyMessage="يرجى اختيار المنطقة أولا"
              placeholder="نوع المقسم"
              disabled={form.id.length > 0 || sectorsBasedOnRegionSchema?.loading}
              hideLoading={sectorsBasedOnRegionSchema?.loading ? false : true}
            />
          </View>
          <View className="my-4">
            <CustomSelecteBox
              value={form.sector_id}
              setValue={(value) => setForm({ ...form, sector_id: value })}
              arrayOfValues={sectors ?? []}
              valueKey="id"
              emptyMessage="يرجى اختيار نوع المقسم أولا"
              placeholder=" المقسم"
              keyName="code"
              disabled={form.id.length > 0 || sectorsBasedOnRegionSchema?.loading}
              hideLoading={sectorsBasedOnRegionSchema?.loading ? false : true}
            />
          </View>
          {currentType === 'apartment' && !form.id && (
            <>
              <View className="my-4">
                <CustomSelecteBox
                  value={form.apartment_type_id}
                  setValue={handleApartmentTypeChange}
                  arrayOfValues={apartmentTypesList}
                  valueKey="id"
                  placeholder="نوع العقار"
                  disabled={form.id.length > 0 || apartmentTypesSchema?.loading}
                  hideLoading={apartmentTypesSchema?.loading ? false : true}
                />
              </View>
              <View className="my-4">
                <CustomSelecteBox
                  value={form.direction_id}
                  setValue={(value) => setForm({ ...form, direction_id: value })}
                  arrayOfValues={directionsList}
                  valueKey="id"
                  placeholder="اتجاه العقار"
                  disabled={form.id.length > 0 || directionsSchema?.loading}
                  hideLoading={directionsSchema?.loading ? false : true}
                />
              </View>
              <View className="my-4">
                <CustomSelecteBox
                  value={form.apartment_status_id}
                  setValue={(value) => setForm({ ...form, apartment_status_id: value })}
                  arrayOfValues={apartmentStatusList}
                  valueKey="id"
                  placeholder="حالة العقار"
                  disabled={form.id.length > 0 || apartmentStatusSchema?.loading}
                  hideLoading={apartmentStatusSchema?.loading ? false : true}
                />
              </View>
              <View className="my-4">
                <Input
                  placeholder="المساحة (متر مربع)"
                  value={form.area}
                  onChangeText={(value) => setForm({ ...form, area: value })}
                  type="numeric"
                  disabled={form.id.length > 0}
                />
              </View>

              {fieldsToShowForApartment.includes('floor') && (
                <View className="my-4">
                  <Input
                    placeholder="الطابق"
                    value={form.floor}
                    onChangeText={(value) => setForm({ ...form, floor: value })}
                    type="numeric"
                    disabled={form.id.length > 0}
                  />
                </View>
              )}
              {fieldsToShowForApartment.includes('rooms_count') && (
                <View className="my-4">
                  <Input
                    placeholder="عدد الغرف"
                    value={form.rooms_count}
                    onChangeText={(value) => setForm({ ...form, rooms_count: value })}
                    type="numeric"
                    disabled={form.id.length > 0}
                  />
                </View>
              )}
              {fieldsToShowForApartment.includes('salons_count') && (
                <View className="my-4">
                  <Input
                    placeholder="عدد الصالونات"
                    value={form.salons_count}
                    onChangeText={(value) => setForm({ ...form, salons_count: value })}
                    type="numeric"
                    disabled={form.id.length > 0}
                  />
                </View>
              )}
              {fieldsToShowForApartment.includes('balcony_count') && (
                <View className="my-4">
                  <Input
                    placeholder="عدد البلكونات"
                    value={form.balcony_count}
                    onChangeText={(value) => setForm({ ...form, balcony_count: value })}
                    type="numeric"
                    disabled={form.id.length > 0}
                  />
                </View>
              )}
              {fieldsToShowForApartment.includes('is_taras') && (
                <View className="my-4">
                  <Text className="mb-2 font-pmedium text-gray-700">تراس</Text>
                  <CustomRadioButtons
                    radioButtons={tarasRadioButtons}
                    handleChangeRadioButton={(value) => setForm({ ...form, is_taras: value })}
                    selectedId={form.is_taras}
                    disabled={form.id.length > 0}
                  />
                </View>
              )}
            </>
          )}
          <View>
            <Text className="font-pmedium text-gray-700">السعر</Text>
            <View
              className={`my-4 justify-between gap-4 ${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'}`}
            >
              <View className="flex-1">
                <CustomSelecteBox
                  value={form.price_operator}
                  setValue={(value) => setForm({ ...form, price_operator: value })}
                  arrayOfValues={price_operator}
                  valueKey="id"
                  placeholder=""
                  disabled={form.id.length > 0}
                  hideLoading={true}
                />
              </View>
              <View className="flex-1">
                <Input
                  placeholder="السعر"
                  value={form.price}
                  onChangeText={(value) => setForm({ ...form, price: value })}
                  type="numeric"
                  disabled={form.id.length > 0}
                  showPlaceholder={false}
                />
              </View>
            </View>
          </View>
          {currentType === 'apartment' && !form.id && (
          <View className="my-4">
                <CustomSelecteBox
                  value={form.payment_method_id}
                  setValue={(value) => setForm({ ...form, payment_method_id: value })}
                  arrayOfValues={paymentMethodsList}
                  valueKey="id"
                  placeholder="طريقة الدفع"
                  disabled={form.id.length > 0 || paymentMethodsSchema?.loading}
                  hideLoading={paymentMethodsSchema?.loading ? false : true}
                />
              </View>
              )}
        </ScrollView>
        <View className="my-4">
          <CustomButton
            hasGradient={true}
            colors={['#633e3d', '#774b46', '#8d5e52', '#a47764', '#bda28c']}
            title={'بحث'}
            containerStyles={'flex-grow'}
            positionOfGradient={'leftToRight'}
            textStyles={'text-white'}
            buttonStyles={'h-[45px]'}
            handleButtonPress={handleSearch}
            loading={false}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SearchScreen;
