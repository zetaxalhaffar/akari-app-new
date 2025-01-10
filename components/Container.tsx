import { SafeAreaView } from 'react-native';

export const Container = ({ children, customStyles }: { children: React.ReactNode; customStyles?: string }) => {
  return <SafeAreaView className={`${styles.container} ${customStyles}`}>{children}</SafeAreaView>;
};

const styles = {
  container: 'flex flex-1 m-6',
};
