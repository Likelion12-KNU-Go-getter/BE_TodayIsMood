
// DrawingPage.jsx
import React, { useRef, useState, useEffect } from 'react';
import './DrawingPage.css';

const DrawingPage = ({ onSave, selectedDate }) => {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const [color, setColor] = useState('#000000');
  const [tool, setTool] = useState('pencil');
  const [mood, setMood] = useState('');

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    setContext(ctx);
  }, []);

  const startDrawing = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    context.beginPath();
    context.moveTo(offsetX, offsetY);
    setDrawing(true);
  };

  const endDrawing = () => {
    context.closePath();
    setDrawing(false);
  };

  const draw = (e) => {
    if (!drawing) return;

    const { offsetX, offsetY } = e.nativeEvent;
    context.lineTo(offsetX, offsetY);
    context.strokeStyle = tool === 'eraser' ? '#FFFFFF' : color;
    context.lineWidth = tool === 'pencil' ? 2 : tool === 'highlighter' ? 10 : 20;
    context.stroke();
  };

  const saveDrawing = async () => {
    const canvas = canvasRef.current;
    const imageData = canvas.toDataURL('image/png'); // Base64 문자열 생성
  
    try {
      const response = await fetch('/api/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer jwt-token', // 실제 JWT 토큰으로 교체
        },
        body: JSON.stringify({
          title: mood,
          imageUrl: imageData, // Base64 데이터 포함
        }),
      });
  
      if (response.ok) {
        const result = await response.json();
        alert(result.message);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error saving diary:', error);
    }
  
    onSave(imageData, mood, selectedDate);
  };
  

  const colors = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FFA500', '#800080'];

  return (
    <div className="drawing-page">
      <div className="mood-container">
        <div className="mood-bubble">
          <input 
            type="text" 
            placeholder="Enter your mood..." 
            value={mood}
            onChange={(e) => setMood(e.target.value)} 
          />
        </div>
      </div>
      <div className="color-palette">
        {colors.map((col) => (
          <div
            key={col}
            className="color-swatch"
            style={{ backgroundColor: col }}
            onClick={() => setColor(col)}
          />
        ))}
      </div>
      <canvas
        ref={canvasRef}
        className="drawing-canvas"
        width={500}
        height={500}
        onMouseDown={startDrawing}
        onMouseUp={endDrawing}
        onMouseMove={draw}
      />
      <div className="tools-container">
        <button onClick={() => setTool('pencil')} className="tool-button">Pencil</button>
        <button onClick={() => setTool('highlighter')} className="tool-button">Highlighter</button>
        <button onClick={() => setTool('eraser')} className="tool-button">Eraser</button>
        <button onClick={saveDrawing} className="save-button">Save</button>
      </div>
    </div>
  );
};

export default DrawingPage;
