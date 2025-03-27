
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface CalculatorProps {
  onClose: () => void;
}

type CalculatorState = {
  displayValue: string;
  previousValue: string;
  operator: string | null;
  waitingForOperand: boolean;
  operationText: string;
};

const Calculator: React.FC<CalculatorProps> = ({ onClose }) => {
  const [state, setState] = useState<CalculatorState>({
    displayValue: '0',
    previousValue: '',
    operator: null,
    waitingForOperand: false,
    operationText: '',
  });

  const inputDigit = (digit: string) => {
    const { displayValue, waitingForOperand } = state;

    if (waitingForOperand) {
      setState({
        ...state,
        displayValue: digit,
        waitingForOperand: false,
      });
    } else {
      setState({
        ...state,
        displayValue: displayValue === '0' ? digit : displayValue + digit,
      });
    }
  };

  const inputDot = () => {
    const { displayValue, waitingForOperand } = state;

    if (waitingForOperand) {
      setState({
        ...state,
        displayValue: '0.',
        waitingForOperand: false,
      });
    } else if (displayValue.indexOf('.') === -1) {
      setState({
        ...state,
        displayValue: displayValue + '.',
        waitingForOperand: false,
      });
    }
  };

  const clearDisplay = () => {
    setState({
      displayValue: '0',
      previousValue: '',
      operator: null,
      waitingForOperand: false,
      operationText: '',
    });
  };

  const toggleSign = () => {
    const { displayValue } = state;

    setState({
      ...state,
      displayValue: displayValue.charAt(0) === '-' ? displayValue.substr(1) : '-' + displayValue,
    });
  };

  const inputPercent = () => {
    const { displayValue } = state;
    const value = parseFloat(displayValue) / 100;

    setState({
      ...state,
      displayValue: String(value),
    });
  };

  const performOperation = (nextOperator: string) => {
    const { displayValue, previousValue, operator } = state;
    const inputValue = parseFloat(displayValue);

    if (previousValue === '') {
      let operationText = '';
      
      if (nextOperator !== '=') {
        operationText = `${displayValue} ${nextOperator}`;
      }
      
      setState({
        ...state,
        previousValue: displayValue,
        waitingForOperand: true,
        operator: nextOperator,
        operationText,
      });
    } else {
      const currentValue = parseFloat(previousValue);
      let newValue: number;
      let operationText = '';

      switch (operator) {
        case '+':
          newValue = currentValue + inputValue;
          operationText = nextOperator === '=' ? `${previousValue} + ${displayValue} =` : `${currentValue + inputValue} ${nextOperator}`;
          break;
        case '-':
          newValue = currentValue - inputValue;
          operationText = nextOperator === '=' ? `${previousValue} - ${displayValue} =` : `${currentValue - inputValue} ${nextOperator}`;
          break;
        case '×':
          newValue = currentValue * inputValue;
          operationText = nextOperator === '=' ? `${previousValue} × ${displayValue} =` : `${currentValue * inputValue} ${nextOperator}`;
          break;
        case '÷':
          newValue = currentValue / inputValue;
          operationText = nextOperator === '=' ? `${previousValue} ÷ ${displayValue} =` : `${currentValue / inputValue} ${nextOperator}`;
          break;
        default:
          newValue = inputValue;
          operationText = nextOperator === '=' ? '' : `${inputValue} ${nextOperator}`;
      }

      setState({
        displayValue: String(newValue),
        previousValue: nextOperator === '=' ? '' : String(newValue),
        waitingForOperand: true,
        operator: nextOperator === '=' ? null : nextOperator,
        operationText,
      });
    }
  };

  return (
    <div className="fixed bottom-4 left-4 md:left-auto md:top-1/2 md:right-4 md:transform md:-translate-y-1/2 w-72 rounded-2xl shadow-calculator border-4 border-yellow-400 overflow-hidden animate-bounce-in z-50">
      <div className="relative w-full h-full">
        {/* Background de imagem que cobre toda a calculadora */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center" 
          style={{
            backgroundImage: 'url(https://imgur.com/eMOC2XR.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between p-3 border-b-4 border-pink-300 bg-gradient-to-r from-purple-300 to-pink-300 backdrop-blur-sm">
            <h3 className="text-sm font-bold text-white drop-shadow-md">Calculadora Mágica</h3>
            <button 
              className="rounded-full p-1 bg-white/80 hover:bg-white text-pink-500 transition-all"
              onClick={onClose}
              aria-label="Fechar calculadora"
            >
              <X size={16} />
            </button>
          </div>
          
          <div className="p-2 relative z-10">
            <div className="bg-white/90 backdrop-blur-md rounded-xl p-4 mb-2 border-2 border-blue-300">
              <div className="text-right text-3xl font-light truncate text-blue-800">{state.displayValue}</div>
              {state.operationText && (
                <div className="text-right text-sm text-gray-500 truncate">
                  {state.operationText}
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-4 gap-1 p-2">
              <button className="calculator-button h-12 bg-gradient-to-r from-red-300 to-red-400 text-white font-bold" onClick={clearDisplay}>C</button>
              <button className="calculator-button h-12 bg-gradient-to-r from-blue-300 to-blue-400 text-white" onClick={toggleSign}>+/-</button>
              <button className="calculator-button h-12 bg-gradient-to-r from-green-300 to-green-400 text-white" onClick={inputPercent}>%</button>
              <button className="calculator-button h-12 bg-gradient-to-r from-purple-300 to-purple-400 text-white font-bold" onClick={() => performOperation('÷')}>÷</button>
              
              <button className="calculator-button h-12 bg-gradient-to-r from-yellow-200 to-yellow-300" onClick={() => inputDigit('7')}>7</button>
              <button className="calculator-button h-12 bg-gradient-to-r from-yellow-200 to-yellow-300" onClick={() => inputDigit('8')}>8</button>
              <button className="calculator-button h-12 bg-gradient-to-r from-yellow-200 to-yellow-300" onClick={() => inputDigit('9')}>9</button>
              <button className="calculator-button h-12 bg-gradient-to-r from-purple-300 to-purple-400 text-white font-bold" onClick={() => performOperation('×')}>×</button>
              
              <button className="calculator-button h-12 bg-gradient-to-r from-yellow-200 to-yellow-300" onClick={() => inputDigit('4')}>4</button>
              <button className="calculator-button h-12 bg-gradient-to-r from-yellow-200 to-yellow-300" onClick={() => inputDigit('5')}>5</button>
              <button className="calculator-button h-12 bg-gradient-to-r from-yellow-200 to-yellow-300" onClick={() => inputDigit('6')}>6</button>
              <button className="calculator-button h-12 bg-gradient-to-r from-purple-300 to-purple-400 text-white font-bold" onClick={() => performOperation('-')}>-</button>
              
              <button className="calculator-button h-12 bg-gradient-to-r from-yellow-200 to-yellow-300" onClick={() => inputDigit('1')}>1</button>
              <button className="calculator-button h-12 bg-gradient-to-r from-yellow-200 to-yellow-300" onClick={() => inputDigit('2')}>2</button>
              <button className="calculator-button h-12 bg-gradient-to-r from-yellow-200 to-yellow-300" onClick={() => inputDigit('3')}>3</button>
              <button className="calculator-button h-12 bg-gradient-to-r from-purple-300 to-purple-400 text-white font-bold" onClick={() => performOperation('+')}>+</button>
              
              <button className="calculator-button h-12 col-span-2 bg-gradient-to-r from-yellow-200 to-yellow-300" onClick={() => inputDigit('0')}>0</button>
              <button className="calculator-button h-12 bg-gradient-to-r from-yellow-200 to-yellow-300 font-bold" onClick={inputDot}>.</button>
              <button className="calculator-button h-12 bg-gradient-to-r from-pink-400 to-pink-500 text-white font-bold" onClick={() => performOperation('=')}>=</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
