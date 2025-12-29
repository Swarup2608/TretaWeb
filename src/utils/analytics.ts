// Analytics utility for tracking page visits
export const trackPageVisit = (page: string) => {
    const visits = JSON.parse(localStorage.getItem('pageVisits') || '{}');
    visits[page] = (visits[page] || 0) + 1;
    localStorage.setItem('pageVisits', JSON.stringify(visits));
    return visits;
};

export const getPageVisits = () => {
    return JSON.parse(localStorage.getItem('pageVisits') || '{}');
};

export const getTotalVisits = () => {
    const visits = getPageVisits();
    return Object.values(visits).reduce((sum: number, count: any) => sum + count, 0) as number;
};

export const getTopPages = (limit = 5) => {
    const visits = getPageVisits();
    return Object.entries(visits)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .slice(0, limit)
        .map(([page, count]) => ({ page, visits: count as number }));
};

export const getUniqueVisitors = () => {
    // Simple estimation based on visits
    const total = getTotalVisits();
    return Math.floor(total * 0.7); // Estimate 70% unique
};

export const getBounceRate = () => {
    // Mock bounce rate
    return '32.4%';
};

export const getAvgSessionDuration = () => {
    // Mock duration
    return '2m 45s';
};