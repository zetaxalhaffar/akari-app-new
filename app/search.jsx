// app/SearchScreen.jsx
import { View, Text, ScrollView, I18nManager } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
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
  const { getRegions, regions, getSectorsBasedOnRegion, sectorsBasedOnRegionSchema } =
    useEnumsStore();

  const [form, setForm] = useState({
    id: '',
    region_id: '',
    sector_id: '',
    price_operator: '=',
    price: '',
  });
  const [currentType, setCurrentType] = useState('share');
  const [sectoreType, setSectoreType] = useState('');
  const [sectorsTypes, setSectorsTypes] = useState([]);
  const [mainSectors, setMainSectors] = useState([]);
  const [sectors, setSectors] = useState([]);

  const unitTypeRadioButtons = useMemo(
    () => [
      { id: 'share', label: 'أسهم تنظيمية', value: 'share', size: 20, color: '#a47764' },
      { id: 'apartment', label: 'عقارات', value: 'apartment', size: 20, color: '#a47764' },
    ],
    [form?.id]
  );

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

  const handleSelectSectorType = async (value) => {
    setSectoreType(value);
    setSectors(mainSectors[value]?.code);
  };

  const getEnums = async () => {
    await getRegions();
  };

  const handleSearch = async () => {
    // Navigate to the Search Results screen and pass the search parameters
    router.push({
      pathname: '/SearchResults',
      params: { ...form, sectoreType, currentType },
    });
  };

  useEffect(() => {
    getEnums();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <CustomHeadWithBackButton
        title="البحث عن وحدة"
        handleButtonPress={() => router.back()}
        rightText={'بحث متقدم'}
      />
      <View className="flex-1 px-4">
        <ScrollView>
          <View>
            <Text className="mb-2 font-pmedium text-gray-700">نوع الوحدة</Text>
            <CustomRadioButtons
              radioButtons={unitTypeRadioButtons}
              handleChangeRadioButton={(value) => setCurrentType(value)}
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
                  editable={false}
                  placeholder=""
                  value={form.price}
                  onChangeText={(value) => setForm({ ...form, price: value })}
                  type="numeric"
                />
              </View>
            </View>
          </View>
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
