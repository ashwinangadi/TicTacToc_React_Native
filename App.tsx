import {
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useRef, useState} from 'react';

const data = ['tl', 'tc', 'tr', 'cl', 'c', 'cr', 'bl', 'bc', 'br'];
const conditions = [
  ['tl', 'tc', 'tr'],
  ['cl', 'c', 'cr'],
  ['bl', 'bc', 'br'],
  ['tl', 'cl', 'bl'],
  ['tc', 'c', 'bc'],
  ['tr', 'cr', 'br'],
  ['tl', 'c', 'br'],
  ['bl', 'c', 'tr'],
];
let visited = new Map();

const App = () => {
  const [Player, setPlayer] = useState({
    oPlayer: true,
    xPlayer: false,
  });
  const [playerWon, setPlayerWon] = useState(false);

  const oPlayerPosition = useRef([]);
  const xPlayerPosition = useRef([]);

  const resetGame = () => {
    visited = new Map();
    setPlayer({oPlayer: !Player.oPlayer, xPlayer: !Player.xPlayer});
    oPlayerPosition.current = [];
    xPlayerPosition.current = [];
    setPlayerWon(false);
  };

  function findWinner() {
    conditions.forEach(condition => {
      if (
        (oPlayerPosition.current.includes(condition[0]) &&
          oPlayerPosition.current.includes(condition[1]) &&
          oPlayerPosition.current.includes(condition[2])) ||
        (xPlayerPosition.current.includes(condition[0]) &&
          xPlayerPosition.current.includes(condition[1]) &&
          xPlayerPosition.current.includes(condition[2]))
      ) {
        setPlayerWon(true);
      }
    });
  }

  const gameLogic = tappedItem => {
    const currentPlayer = Player.oPlayer ? 'O' : 'X';
    currentPlayer === 'O'
      ? (oPlayerPosition.current = [...oPlayerPosition.current, tappedItem])
      : (xPlayerPosition.current = [...xPlayerPosition.current, tappedItem]);

    setPlayer({oPlayer: !Player.oPlayer, xPlayer: !Player.xPlayer});

    if (!visited.has(tappedItem)) {
      visited.set(tappedItem, currentPlayer);
    }

    findWinner();

    // console.log(oPlayerPosition.current[2]);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.playerTurn}>
        <Text style={styles.turnText}>
          {Player.oPlayer ? <Text>O</Text> : <Text>X</Text>}
          's Turn
        </Text>
        {playerWon && (
          <Text style={styles.result}>
            {Player.oPlayer ? <Text>X</Text> : <Text>O</Text>} Won
          </Text>
        )}
      </View>

      <View style={styles.gameContainer}>
        <FlatList
          data={data}
          renderItem={item => (
            <View style={styles.gameItems}>
              <Pressable
                onPress={() => gameLogic(item.item)}
                disabled={visited.has(item.item) || playerWon}
                // activeOpacity={playerWon ? 1 : 0}
                style={styles.resetButton}>
                {visited.has(item.item) ? (
                  <Text style={styles.XOtext}>{visited.get(item.item)}</Text>
                ) : (
                  <Image
                    source={require('./assets/question.png')}
                    style={{width: 25, height: 40}}
                  />
                )}
              </Pressable>
            </View>
          )}
          keyExtractor={data => data}
          numColumns={3}
        />
      </View>

      <TouchableOpacity onPress={resetGame} style={styles.resetButton}>
        <Text style={styles.resetText}>Reload Game</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 300,
  },
  playerTurn: {
    paddingHorizontal: 50,
    paddingVertical: 10,
    backgroundColor: 'gray',
  },
  gameContainer: {
    // position: 'relative',
    width: '100%',
    height: '200',
    justifyContent: 'center',
    alignItems: 'center',
  },
  result: {
    position: 'absolute',
    fontSize: 50,
    fontWeight: '800',
    borderWidth: 5,
    borderColor: 'gray',
    backgroundColor: 'black',
    padding: 20,
    textAlign: 'center',
  },
  gameItems: {
    margin: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 80,
  },
  turnText: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
  },
  resetButton: {},
  resetText: {
    paddingHorizontal: 50,
    paddingVertical: 10,
    backgroundColor: 'gray',
    color: 'white',
    fontSize: 20,
  },
  XOtext: {
    fontSize: 40,
    fontWeight: '700',
  },
});
