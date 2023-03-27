import { StyleSheet, Text, useColorScheme, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { BarCodeScanningResult, Camera } from 'expo-camera';
// @ts-ignore
import vCardParser from 'vcard-parser';

interface VCard {
  [key: string]: {
    value: string;
  }[];
}

const TabOneScreen: React.FC = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [vCardData, setVCardData] = useState<VCard | null>(null);

  useEffect(() => {
    (async () => {
      const { granted } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(granted);
    })();
  }, []);

  const onBarCodeScanned = (e: BarCodeScanningResult) => {
    if (e.type.toLowerCase().includes('qrcode') && e.data.startsWith('BEGIN:VCARD')) {
      const vCard = vCardParser.parse(e.data) as VCard;
      setVCardData(vCard);
    }
  };

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
      <View style={styles.container}>
        <Camera style={styles.camera} onBarCodeScanned={onBarCodeScanned} />
        {vCardData && <VCardDisplay vCardData={vCardData} />}
      </View>
  );
};

interface VCardDisplayProps {
  vCardData: VCard;
}

const VCardDisplay: React.FC<VCardDisplayProps> = ({ vCardData }) => {
  return (
      <View style={styles.container}>
        {Object.entries(vCardData).map(([key, value]) => (
            <Text key={key} style={styles.vCardText}>
              {key}: {value[0].value}
            </Text>
        ))}
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  camera: {
    flex: 1,
  },
  vCardContainer: {
    backgroundColor: 'white',
    padding: 10,
  },
  vCardText: {
    fontSize: 16,
    color: 'white',
  },
});

export default TabOneScreen;