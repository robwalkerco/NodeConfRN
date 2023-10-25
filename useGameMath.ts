export const useGameMath = ({
  playableWidth,
  playableHeight,
  ballWidth,
  targetWidth,
  targetBorderWidth,
}: {
  playableWidth: number;
  playableHeight: number;
  ballWidth: number;
  targetWidth: number;
  targetBorderWidth: number;
}) => {
  const getCenterPosition = () => ({
    x: (playableWidth - ballWidth) / 2,
    y: (playableHeight - ballWidth) / 2,
  });

  const getRandomTargetPosition = () => ({
    x: Math.random() * (playableWidth - targetWidth),
    y: Math.random() * (playableHeight - targetWidth),
  });

  const getIsBallInTarget = ({
    ballX,
    ballY,
    targetX,
    targetY,
  }: {
    ballX: number;
    ballY: number;
    targetX: number;
    targetY: number;
  }) =>
    ballX > targetX + targetBorderWidth &&
    ballX + ballWidth < targetX + targetWidth - targetBorderWidth &&
    ballY > targetY + targetBorderWidth &&
    ballY + ballWidth < targetY + targetWidth - targetBorderWidth;

  const getConstrainedBallX = (ballX: number) =>
    Math.max(0, Math.min(ballX, playableWidth - ballWidth));

  const getConstrainedBallY = (ballY: number) =>
    Math.max(0, Math.min(ballY, playableHeight - ballWidth));

  return {
    getCenterPosition,
    getRandomTargetPosition,
    getIsBallInTarget,
    getConstrainedBallX,
    getConstrainedBallY,
  };
};
