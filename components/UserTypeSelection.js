import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const UserTypeSelection = ({ selectedType, onTypeSelect }) => {
  const [selected, setSelected] = useState(selectedType);

  const handleTypeSelect = (type) => {
    setSelected(type);
    onTypeSelect(type);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Are you a Volunteer or Admin?</Text>
      <View style={styles.radioContainer}>
        <TouchableOpacity
          style={[styles.radioButton, selected === 'Volunteer' && styles.selectedRadioButton]}
          onPress={() => handleTypeSelect('Volunteer')}
        >
          <Text style={[styles.radioText, selected === 'Volunteer' && styles.selectedRadioText]}>{'Volunteer'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.radioButton, selected === 'Admin' && styles.selectedRadioButton]}
          onPress={() => handleTypeSelect('Admin')}
        >
          <Text style={[styles.radioText, selected === 'Admin' && styles.selectedRadioText]}>{'Admin'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UserTypeSelection;

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'black',
  },

  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingtop: 10,
    paddingHorizontal: 40,
    marginHorizontal: 10,
    padding: 10,
  },
  selectedRadioButton: {
    backgroundColor: '#F07B10',
    borderRadius: 20,
    paddingVertical: 10,
  },
  radioText: {
    fontSize: 20,
    marginLeft: 0,
    fontWeight: 'bold',
  },
  selectedRadioText: {
    color: 'white',
  },
});
