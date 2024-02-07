import React from 'react';
import { View, Image } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const QRCodeWithLogo = ({ value, logo }) => {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <QRCode
          value={value}
          size={230}
          logo={logo}
          logoSize={70}
          logoBackgroundColor="white"
          logoBorderRadius={35}
        />
      </View>
    );
  };
  
  export default QRCodeWithLogo;