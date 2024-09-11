import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ROUNDS = 10;

const MainScreen = () => {
  const navigation = useNavigation();
  const [pokemon, setPokemon] = useState({});
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [round, setRound] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    fetchNewPokemon();
  }, []);

  const fetchPokemonList = async () => {
    try {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000');
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const fetchNewPokemon = async () => {
    try {
      const allPokemons = await fetchPokemonList();
      const randomIndex = Math.floor(Math.random() * allPokemons.length);
      const correctPokemon = allPokemons[randomIndex];
      const response = await fetch(correctPokemon.url);
      const data = await response.json();
      setPokemon(data);

      const optionsList = [correctPokemon];
      while (optionsList.length < 4) {
        const randomIndex = Math.floor(Math.random() * allPokemons.length);
        const randomPokemon = allPokemons[randomIndex];
        if (!optionsList.some(p => p.name === randomPokemon.name)) {
          optionsList.push(randomPokemon);
        }
      }

      setOptions(optionsList.sort(() => Math.random() - 0.5));
      setFeedback('');
      setWaiting(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFeedbackTimeout = () => {
    setTimeout(() => {
      const newRound = round + 1;
      if (newRound >= ROUNDS) {
        setGameOver(true);
      } else {
        setRound(newRound);
        fetchNewPokemon();
      }
    }, 3000);
  };

  const checkGuess = (chosenPokemon) => {
    if (waiting) return;

    setWaiting(true);

    if (chosenPokemon.name === pokemon.name) {
      setFeedback(`Correto! ${chosenPokemon.name.charAt(0).toUpperCase() + chosenPokemon.name.slice(1)} é o Pokémon certo.`);
      setScore(score + 1);
    } else {
      setFeedback(`Incorreto! O Pokémon correto era ${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}. Tente novamente!`);
      setWrongAttempts(wrongAttempts + 1);
    }

    handleFeedbackTimeout();
  };

  if (gameOver) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Jogo Finalizado!</Text>
        <Text style={styles.feedback}>Pontuação Final: {score}</Text>
        <Text style={styles.feedback}>Tentativas Erradas: {wrongAttempts}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => {
            setScore(0);
            setWrongAttempts(0);
            setRound(0);
            setGameOver(false);
            fetchNewPokemon();
          }}>
            <Text style={styles.buttonText}>Jogar Novamente</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => {
            navigation.navigate('SplashScreen'); // Altere para o nome da sua tela inicial
          }}>
            <Text style={styles.buttonText}>Voltar à Tela Inicial</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adivinhe o Pokémon</Text>
      <Image
        source={{ uri: pokemon.sprites?.front_default }}
        style={styles.image}
      />
      <Text style={styles.feedback}>Escolha o Pokémon:</Text>
      {options.map((option) => (
        <TouchableOpacity
          key={option.name}
          style={[styles.optionButton, waiting && styles.optionButtonDisabled]}
          onPress={() => checkGuess(option)}
          disabled={waiting}
        >
          <Text style={styles.optionText}>{option.name}</Text>
        </TouchableOpacity>
      ))}
      <Text style={styles.feedback}>{feedback}</Text>
      <Text style={styles.score}>Pontuação: {score}</Text>
      <Text style={styles.wrongAttempts}>Tentativas Erradas: {wrongAttempts}</Text>
      <Text style={styles.round}>Rodada: {round + 1} / {ROUNDS}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#E3F2FD', // Cor de fundo clara e azulada
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0288D1', // Azul escuro
    marginBottom: 16,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75, // Borda arredondada
    borderWidth: 3,
    borderColor: '#FF9800', // Laranja para a borda
    marginBottom: 16,
  },
  feedback: {
    fontSize: 18,
    color: '#01579B', // Azul mais escuro para feedback
    marginBottom: 16,
  },
  score: {
    fontSize: 18,
    color: '#0288D1', // Azul escuro para a pontuação
    marginTop: 16,
  },
  wrongAttempts: {
    fontSize: 18,
    color: '#D32F2F', // Vermelho escuro para tentativas erradas
    marginTop: 8,
  },
  round: {
    fontSize: 18,
    color: '#0288D1', // Azul escuro
    marginTop: 8,
  },
  optionButton: {
    backgroundColor: '#FF9800', // Laranja para o fundo dos botões
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 18,
    color: '#fff', // Cor do texto dos botões
  },
  optionButtonDisabled: {
    backgroundColor: '#B0BEC5', // Cor cinza para indicar desativado
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#0288D1', // Azul escuro para botões finais
    padding: 12,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff', // Cor do texto dos botões finais
  },
});

export default MainScreen;
