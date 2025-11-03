import { Measurements, HealthStatus } from '@/types/waterBody';

export function calculateHealthScore(measurements: Measurements): number {
  let score = 0;

  // pH Score (20 points) - Optimal: 6.5-8.5
  if (measurements.pH !== null) {
    if (measurements.pH >= 6.5 && measurements.pH <= 8.5) {
      score += 20;
    } else if (measurements.pH >= 6.0 && measurements.pH <= 9.0) {
      score += 15;
    } else if (measurements.pH >= 5.5 && measurements.pH <= 9.5) {
      score += 10;
    } else {
      score += 5;
    }
  }

  // Dissolved Oxygen Score (30 points) - Optimal: >6 mg/L
  if (measurements.dissolvedOxygen !== null) {
    if (measurements.dissolvedOxygen >= 6) {
      score += 30;
    } else if (measurements.dissolvedOxygen >= 4) {
      score += 22;
    } else if (measurements.dissolvedOxygen >= 2) {
      score += 15;
    } else {
      score += 5;
    }
  }

  // Turbidity Score (20 points) - Optimal: <25 NTU
  if (measurements.turbidity !== null) {
    if (measurements.turbidity < 25) {
      score += 20;
    } else if (measurements.turbidity < 50) {
      score += 15;
    } else if (measurements.turbidity < 100) {
      score += 10;
    } else {
      score += 5;
    }
  }

  // Temperature Score (10 points) - Optimal: 15-25°C
  if (measurements.temperature !== null) {
    if (measurements.temperature >= 15 && measurements.temperature <= 25) {
      score += 10;
    } else if (measurements.temperature >= 10 && measurements.temperature <= 30) {
      score += 7;
    } else {
      score += 3;
    }
  }

  // Pollutants Score (20 points) - Lower is better
  let pollutantScore = 20;

  if (measurements.bod !== null && measurements.bod > 5) {
    pollutantScore -= 5;
  }
  if (measurements.cod !== null && measurements.cod > 20) {
    pollutantScore -= 5;
  }
  if (measurements.nitrates !== null && measurements.nitrates > 10) {
    pollutantScore -= 3;
  }
  if (measurements.phosphates !== null && measurements.phosphates > 0.5) {
    pollutantScore -= 3;
  }
  if (measurements.fecalColiform !== null && measurements.fecalColiform > 500) {
    pollutantScore -= 4;
  }

  score += Math.max(0, pollutantScore);

  return Math.round(Math.min(100, Math.max(0, score)));
}

export function getHealthStatus(score: number): HealthStatus {
  if (score >= 85) return 'excellent';
  if (score >= 70) return 'good';
  if (score >= 50) return 'fair';
  if (score >= 30) return 'poor';
  return 'critical';
}

export function getHealthColor(status: HealthStatus): string {
  const colors = {
    excellent: 'hsl(var(--status-excellent))',
    good: 'hsl(var(--status-good))',
    fair: 'hsl(var(--status-fair))',
    poor: 'hsl(var(--status-poor))',
    critical: 'hsl(var(--status-critical))',
  };
  return colors[status];
}

export function getHealthBadgeClass(status: HealthStatus): string {
  const classes = {
    excellent: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    good: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    fair: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    poor: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    critical: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };
  return classes[status];
}
