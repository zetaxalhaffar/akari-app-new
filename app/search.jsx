// app/SearchScreen.jsx
import { View, Text, ScrollView, I18nManager } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import CustomHeadWithBackButton from '../components/CustomHeadWithBackButton';
import { Input } from '@/components/CustomInput';
import CustomRadioButtons from '../components/CustomRadioButtons';
import CustomSelecteBox from '@/components/CustomSelecteBox.jsx';
import { useEnumsStore } from '../store/enums.store';
import CustomButton from '@/components/CustomButton.jsx';
import CustomAlert from '@/components/CustomAlert.jsx';

const price_operator = [
  { name: 'مساوي', id: '=' },
  { name: 'أكبر', id: '>' },
  { name: 'أصغر', id: '<' },
  { name: 'أكبر أو مساوي', id: '>=' },
  { name: 'أصغر أو مساوي', id: '<=' },
];

const SearchScreen = () => {
  // Get region_id and current_tab from params if coming from a specific region
  const { region_id: paramRegionId, current_tab: paramCurrentTab } = useLocalSearchParams();
  
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

  // Alert state for service unavailable
  const [showServiceAlert, setShowServiceAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [pendingRegionChange, setPendingRegionChange] = useState(null);

  const unitTypeRadioButtons = useMemo(() => {
    const allOptions = [
      { id: 'share', label: 'أسهم تنظيمية', value: 'share', size: 20, color: '#a47764' },
      { id: 'apartment', label: 'عقارات', value: 'apartment', size: 20, color: '#a47764' },
    ];

    // If no region is selected, show all options
    if (!form.region_id) {
      return allOptions;
    }

    // Find the selected region
    const selectedRegion = regions?.find(region => region.id.toString() === form.region_id.toString());
    
    if (!selectedRegion) {
      return allOptions;
    }

    // Filter options based on region flags
    return allOptions.filter(option => {
      if (option.id === 'share') {
        return selectedRegion.has_share === 1;
      }
      if (option.id === 'apartment') {
        return selectedRegion.has_apartment === 1;
      }
      return true;
    });
  }, [form?.id, form?.region_id, regions]);

  const handleChangeRegion = async (value) => {
    // Find the selected region to check available services
    const selectedRegion = regions?.find(region => region.id.toString() === value.toString());
    
    if (!selectedRegion) return;
    
    const isShareAvailable = selectedRegion.has_share === 1;
    const isApartmentAvailable = selectedRegion.has_apartment === 1;
    
    // Check if this is initial load from params
    const isInitialLoad = paramRegionId && value.toString() === paramRegionId.toString();
    
    // Check if current service becomes unavailable (only for manual region changes, not initial load)
    // Show alert when user manually changes region and their current selection becomes unavailable
    if (!isInitialLoad && currentType) {
      let shouldShowAlert = false;
      let message = '';
      
      if (currentType === 'share' && !isShareAvailable && isApartmentAvailable) {
        shouldShowAlert = true;
        message = 'الأسهم التنظيمية غير متوفرة في هذه المنطقة. سيتم التبديل إلى العقارات.';
      } else if (currentType === 'apartment' && !isApartmentAvailable && isShareAvailable) {
        shouldShowAlert = true;
        message = 'العقارات غير متوفرة في هذه المنطقة. سيتم التبديل إلى الأسهم التنظيمية.';
      }
      
      if (shouldShowAlert) {
        setAlertMessage(message);
        setPendingRegionChange({
          value,
          selectedRegion,
          isShareAvailable,
          isApartmentAvailable
        });
        setShowServiceAlert(true);
        return; // Don't proceed with region change yet
      }
    }
    
    // Proceed with region change
    await proceedWithRegionChange(value, selectedRegion, isShareAvailable, isApartmentAvailable, isInitialLoad);
  };

  const proceedWithRegionChange = async (value, selectedRegion, isShareAvailable, isApartmentAvailable, isInitialLoad = false) => {
    // Determine new unit type
    let newCurrentType = currentType;
    
    if (isInitialLoad) {
      // Initial load from params, use the current tab from the region page
      if (paramCurrentTab) {
        // Use the tab that was active in the region page
        if (paramCurrentTab === 'shares' && isShareAvailable) {
          newCurrentType = 'share';
        } else if (paramCurrentTab === 'apartments' && isApartmentAvailable) {
          newCurrentType = 'apartment';
        } else {
          // Fallback: if the tab from region page is not available, pick first available
          if (isShareAvailable) {
            newCurrentType = 'share';
          } else if (isApartmentAvailable) {
            newCurrentType = 'apartment';
          }
        }
      } else {
        // No tab info, use default prioritizing shares
        if (isShareAvailable) {
          newCurrentType = 'share';
        } else if (isApartmentAvailable) {
          newCurrentType = 'apartment';
        }
      }
    } else {
      // Manual region change
      if (currentType === 'share' && !isShareAvailable) {
        if (isApartmentAvailable) {
          newCurrentType = 'apartment';
        }
      } else if (currentType === 'apartment' && !isApartmentAvailable) {
        if (isShareAvailable) {
          newCurrentType = 'share';
        }
      }
      // If current type is available in new region, keep it as is
    }
    
    setCurrentType(newCurrentType);
    setForm({ ...form, region_id: value, sector_id: '', apartment_type_id: '', direction_id: '', apartment_status_id: '', payment_method_id: '', area: '', floor: '', rooms_count: '', salons_count: '', balcony_count: '', is_taras: '0' });
    setSectoreType('');
    setSectors([]);
    setFieldsToShowForApartment([]);
    
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

  const handleAlertConfirm = async () => {
    setShowServiceAlert(false);
    if (pendingRegionChange) {
      const { value, selectedRegion, isShareAvailable, isApartmentAvailable } = pendingRegionChange;
      await proceedWithRegionChange(value, selectedRegion, isShareAvailable, isApartmentAvailable);
      setPendingRegionChange(null);
    }
  };

  const handleAlertCancel = () => {
    setShowServiceAlert(false);
    setPendingRegionChange(null);
    // Region selection stays as it was
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

  // Initialize form with region from params if provided
  useEffect(() => {
    if (paramRegionId && regions && regions.length > 0) {
      // Auto-populate region and handle unit type selection
      handleChangeRegion(paramRegionId);
    }
  }, [paramRegionId, regions]);

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
            {unitTypeRadioButtons.length === 0 ? (
              <View className="py-4 px-3 bg-gray-100 rounded-lg border border-gray-200">
                <Text className="text-center text-gray-600 font-pregular">
                  يرجى اختيار منطقة أولاً أو هذه المنطقة لا تحتوي على خدمات متاحة
                </Text>
              </View>
            ) : (
              <CustomRadioButtons
                radioButtons={unitTypeRadioButtons}
                handleChangeRadioButton={handleUnitTypeChange}
                selectedId={currentType}
                disabled={form.id.length > 0}
              />
            )}
          </View>
          <View>
            <Input
              placeholder="الرقم المرجعي"
              value={form.id}
              onChangeText={(value) => setForm({ ...form, id: value })}
              type="numeric"
              disabled={unitTypeRadioButtons.length === 0}
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
              disabled={unitTypeRadioButtons.length === 0 || form.id.length > 0 || sectorsBasedOnRegionSchema?.loading}
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
              disabled={unitTypeRadioButtons.length === 0 || form.id.length > 0 || sectorsBasedOnRegionSchema?.loading}
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
                  disabled={unitTypeRadioButtons.length === 0 || form.id.length > 0 || apartmentTypesSchema?.loading}
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
                  disabled={unitTypeRadioButtons.length === 0 || form.id.length > 0 || directionsSchema?.loading}
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
                  disabled={unitTypeRadioButtons.length === 0 || form.id.length > 0 || apartmentStatusSchema?.loading}
                  hideLoading={apartmentStatusSchema?.loading ? false : true}
                />
              </View>
              <View className="my-4">
                <Input
                  placeholder="المساحة (متر مربع)"
                  value={form.area}
                  onChangeText={(value) => setForm({ ...form, area: value })}
                  type="numeric"
                  disabled={unitTypeRadioButtons.length === 0 || form.id.length > 0}
                />
              </View>

              {fieldsToShowForApartment.includes('floor') && (
                <View className="my-4">
                  <Input
                    placeholder="الطابق"
                    value={form.floor}
                    onChangeText={(value) => setForm({ ...form, floor: value })}
                    type="numeric"
                    disabled={unitTypeRadioButtons.length === 0 || form.id.length > 0}
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
                    disabled={unitTypeRadioButtons.length === 0 || form.id.length > 0}
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
                    disabled={unitTypeRadioButtons.length === 0 || form.id.length > 0}
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
                    disabled={unitTypeRadioButtons.length === 0 || form.id.length > 0}
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
                    disabled={unitTypeRadioButtons.length === 0 || form.id.length > 0}
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
                  disabled={unitTypeRadioButtons.length === 0 || form.id.length > 0}
                  hideLoading={true}
                />
              </View>
              <View className="flex-1">
                <Input
                  placeholder="السعر"
                  value={form.price}
                  onChangeText={(value) => setForm({ ...form, price: value })}
                  type="numeric"
                  disabled={unitTypeRadioButtons.length === 0 || form.id.length > 0}
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
                  disabled={unitTypeRadioButtons.length === 0 || form.id.length > 0 || paymentMethodsSchema?.loading}
                  hideLoading={paymentMethodsSchema?.loading ? false : true}
                />
              </View>
              )}
        </ScrollView>
        <View className="my-4">
          <CustomButton
            hasGradient={true}
            colors={['#633e3d', '#774b46', '#8d5e52', '#a47764', '#bda28c']}
            title={unitTypeRadioButtons.length === 0 ? 'لا تتوفر خدمات في هذه المنطقة' : 'بحث'}
            containerStyles={'flex-grow'}
            positionOfGradient={'leftToRight'}
            textStyles={'text-white'}
            buttonStyles={'h-[45px]'}
            handleButtonPress={handleSearch}
            loading={false}
            disabled={unitTypeRadioButtons.length === 0}
          />
        </View>
      </View>

      {/* Service Unavailable Alert */}
      <CustomAlert
        visible={showServiceAlert}
        title="تغيير نوع الخدمة"
        message={alertMessage}
        onConfirm={handleAlertConfirm}
        onCancel={handleAlertCancel}
      />
    </SafeAreaView>
  );
};

export default SearchScreen;
