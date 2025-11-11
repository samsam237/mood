export const moodService = {
  generateAnalytics(moods) {
    if (!moods || moods.length === 0) {
      return {
        averageMood: 0,
        moodTrend: [],
        moodDistribution: {},
        weeklyAverage: 0,
      };
    }

    // Calculate average mood
    const averageMood = moods.reduce((sum, mood) => sum + mood.value, 0) / moods.length;

    // Generate mood trend for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentMoods = moods.filter(
      mood => new Date(mood.timestamp) >= thirtyDaysAgo
    );

    const moodTrend = recentMoods.map(mood => ({
      date: new Date(mood.timestamp).toLocaleDateString(),
      value: mood.value,
    }));

    // Calculate mood distribution
    const moodDistribution = moods.reduce((acc, mood) => {
      acc[mood.label] = (acc[mood.label] || 0) + 1;
      return acc;
    }, {});

    // Calculate weekly average
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weeklyMoods = moods.filter(
      mood => new Date(mood.timestamp) >= weekAgo
    );
    const weeklyAverage = weeklyMoods.length > 0 
      ? weeklyMoods.reduce((sum, mood) => sum + mood.value, 0) / weeklyMoods.length
      : 0;

    return {
      averageMood,
      moodTrend,
      moodDistribution,
      weeklyAverage,
    };
  },
};
