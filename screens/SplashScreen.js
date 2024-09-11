import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const SplashScreen = ({ navigation }) => {
  // Função para navegar para a tela principal
  const navigateToMainScreen = () => {
    navigation.replace('MainScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao Adivinhe o Pokémon!</Text>
      <TouchableOpacity 
        style={styles.button} 
        onPress={navigateToMainScreen}
      >
        <Text style={styles.buttonText}>Ir para a Tela Principal</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E3F2FD', // Cor de fundo azul clara para combinar com o MainScreen
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0288D1', // Azul escuro para o texto principal
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#FF9800', // Laranja para o botão
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff', // Cor do texto do botão
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default SplashScreen;
