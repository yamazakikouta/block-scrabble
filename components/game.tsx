'use client'
import React, { useEffect, useRef } from 'react';

export function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!canvasRef.current) {
      throw new Error('objectがnull');
    }
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Game constants
    const CANVAS_WIDTH = 800
    const CANVAS_HEIGHT = 600
    const PADDLE_WIDTH = 100
    const PADDLE_HEIGHT = 20
    const BALL_RADIUS = 10
    const BLOCK_WIDTH = 80
    const BLOCK_HEIGHT = 30
    const BLOCK_COLS = 8
    const BLOCK_ROWS = 5

    // Game variables
    let paddleX = (CANVAS_WIDTH - PADDLE_WIDTH) / 2
    let ballX = CANVAS_WIDTH / 2
    let ballY = CANVAS_HEIGHT - PADDLE_HEIGHT - 30 - BALL_RADIUS
    let ballSpeedX = 5
    let ballSpeedY = -5
    let score = 0
    let gameState = 'start' // 'start', 'playing', 'gameover', 'win'

    // Create blocks
    const blocks: { x: number; y: number; visible: boolean }[] = []
    for (let c = 0; c < BLOCK_COLS; c++) {
      for (let r = 0; r < BLOCK_ROWS; r++) {
        blocks.push({
          x: c * (BLOCK_WIDTH + 10) + 15,
          y: r * (BLOCK_HEIGHT + 5) + 30,
          visible: true,
        })
      }
    }

    // Draw functions
    function drawPaddle() {
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(paddleX, CANVAS_HEIGHT - PADDLE_HEIGHT - 30, PADDLE_WIDTH, PADDLE_HEIGHT)
    }

    function drawBall() {
      ctx.fillStyle = '#FFFFFF'
      ctx.beginPath()
      ctx.arc(ballX, ballY, BALL_RADIUS, 0, Math.PI * 2)
      ctx.fill()
    }

    function drawBlocks() {
      blocks.forEach((block) => {
        if (block.visible) {
          ctx.fillStyle = '#0000FF'
          ctx.fillRect(block.x, block.y, BLOCK_WIDTH, BLOCK_HEIGHT)
        }
      })
    }

    function drawScore() {
      ctx.fillStyle = '#FFFFFF'
      ctx.font = '16px Arial'
      ctx.fillText(`Score: ${score}`, CANVAS_WIDTH - 100, 20)
    }

    function drawText(text: string) {
      ctx.fillStyle = '#FFFFFF'
      ctx.font = '32px Arial'
      ctx.fillText(text, CANVAS_WIDTH / 2 - 100, CANVAS_HEIGHT / 2)
    }

    // Game logic
    function update() {
      if (gameState !== 'playing') return

      ballX += ballSpeedX
      ballY += ballSpeedY

      // Wall collision
      if (ballX + BALL_RADIUS > CANVAS_WIDTH || ballX - BALL_RADIUS < 0) {
        ballSpeedX = -ballSpeedX
      }
      if (ballY - BALL_RADIUS < 0) {
        ballSpeedY = -ballSpeedY
      }

      // Paddle collision
      if (
        ballY + BALL_RADIUS > CANVAS_HEIGHT - PADDLE_HEIGHT - 30 &&
        ballX > paddleX &&
        ballX < paddleX + PADDLE_WIDTH
      ) {
        ballSpeedY = -ballSpeedY
      }

      // Block collision
      blocks.forEach((block) => {
        if (block.visible) {
          if (
            ballX > block.x &&
            ballX < block.x + BLOCK_WIDTH &&
            ballY > block.y &&
            ballY < block.y + BLOCK_HEIGHT
          ) {
            ballSpeedY = -ballSpeedY
            block.visible = false
            score += 10
          }
        }
      })

      // Game over
      if (ballY + BALL_RADIUS > CANVAS_HEIGHT) {
        gameState = 'gameover'
      }

      // Win condition
      if (blocks.every((block) => !block.visible)) {
        gameState = 'win'
      }
    }

    function draw() {
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      drawPaddle()
      drawBall()
      drawBlocks()
      drawScore()

      if (gameState === 'start') {
        drawText('Click to Start')
      } else if (gameState === 'gameover') {
        drawText('Game Over')
      } else if (gameState === 'win') {
        drawText('You Win!')
      }
    }

    function gameLoop() {
      update()
      draw()
      requestAnimationFrame(gameLoop)
    }

    // Event listeners
    function handleMouseMove(e: MouseEvent) {
      const rect = canvas.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      paddleX = mouseX - PADDLE_WIDTH / 2
      if (paddleX < 0) paddleX = 0
      if (paddleX + PADDLE_WIDTH > CANVAS_WIDTH) paddleX = CANVAS_WIDTH - PADDLE_WIDTH
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft' && paddleX > 0) {
        paddleX -= 20
      } else if (e.key === 'ArrowRight' && paddleX + PADDLE_WIDTH < CANVAS_WIDTH) {
        paddleX += 20
      }
    }

    function handleClick() {
      if (gameState === 'start') {
        gameState = 'playing'
      }
    }

    canvas.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('keydown', handleKeyDown)
    canvas.addEventListener('click', handleClick)

    gameLoop()

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('keydown', handleKeyDown)
      canvas.removeEventListener('click', handleClick)
    }
  }, [])

  return <canvas ref={canvasRef} width={800} height={600} />
}