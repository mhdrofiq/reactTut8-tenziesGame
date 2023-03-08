import React from "react"
import Die from "./components/Die"
import {nanoid} from "nanoid"
import Confetti from 'react-confetti'

export default function App(){

  //set the app state to receive the return of allNewDice()
  const [dice, setDice] = React.useState(allNewDice())
  //tenzies indicates if the player has won or not
  const [tenzies, setTenzies] = React.useState(false)

  React.useEffect(() => {
    //check if every dice is being held
    const allHeld = dice.every(die => die.isHeld)
    //get the value of the first dice
    const firstValue = dice[0].value
    //check if every dice has the same value as the first
    const allSameValue = dice.every(die => die.value == firstValue)
    //win the game if every dice is held and all have the same value
    if(allHeld && allSameValue) {
      setTenzies(true)
    }
  }, [dice])

  //this is a helper function that makes a new die
  function generateNewDie(){
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid()
    }
  }

  //return an array of new dice
  function allNewDice(){
    const randomNumArr = [] 
    for(let i=0; i<10; i++){
      //make a new die and push it into the temp array
      randomNumArr.push(generateNewDie())
    }
    return randomNumArr
  }

  //make 10 Die components that have been set from the state
  const diceElements = dice.map(die => 
    <Die 
      key={die.id} 
      value={die.value} 
      isHeld={die.isHeld}
      //use an anonymous function to pass the die's id 
        //initialized in App to the Die component 
      holdDice={() => holdDice(die.id)}
    />
  )

  function rollDice(){
    //if the player hasnt won yet
    if(!tenzies){
      setDice(prevDice => prevDice.map(die =>
        //is the current die being held?
          //if true retain previous die
          //if false generate new die 
        die.isHeld ? die : generateNewDie()
      ))
    } else {
      setTenzies(false)
      setDice(allNewDice())
    }
  }

  function holdDice(id){
    //oldArray => oldArray.map()
      //this ^ means 'look at oldArray and return the product of oldArray.map'
    //die => if else condition
      //this ^ means 'look at die and return the product of the conditional
    setDice(prevDice => prevDice.map(die => 
       die.id === id ? {...die, isHeld: !die.isHeld} : die
    ))
  }

  return(
    <main>
      {/* show confetti if player won tenzies */}
      {tenzies && <Confetti/>}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        Roll until all dice are the same. Click each die 
        to freeze it at its current value between rolls.
      </p>
      <div className="die-container">
        {diceElements}
      </div>
      <button onClick={rollDice}>
        {tenzies ? "New Game" : "Roll!"}
      </button>
    </main>
  )
}
