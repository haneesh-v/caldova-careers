import { describe, it, expect } from 'vitest';
import { filterJobs, sortByNewest, formatPostedDate } from './jobs';
import type { Job } from '../types/job';

function makeJob(
    slug: string,
    postedDate: string,
    department = 'Technology',
    location = 'Remote',
): Job {
    return {
        slug,
        title: `Role ${slug}`,
        department,
        location,
        type: 'Full-time',
        remote: true,
        postedDate,
        summary: 'A role.',
    };
}

describe('filterJobs', () => {
    const jobs = [
        makeJob('frontend', '2027-01-01', 'Technology', 'Remote'),
        makeJob('platform', '2027-01-02', 'Technology', 'Vancouver'),
        makeJob('finance-woodinville', '2027-01-03', 'Finance', 'Woodinville'),
        makeJob('finance-helsinki', '2027-01-04', 'Finance', 'Helsinki'),
    ];

    it('filters by department, allowing multiple selected departments', () => {
        expect(filterJobs(jobs, ['Technology', 'Finance'], []).map((job) => job.slug)).toEqual([
            'frontend',
            'platform',
            'finance-woodinville',
            'finance-helsinki',
        ]);
        expect(filterJobs(jobs, ['Technology'], []).map((job) => job.slug)).toEqual([
            'frontend',
            'platform',
        ]);
    });

    it('filters by location, allowing multiple selected locations', () => {
        expect(filterJobs(jobs, [], ['Remote', 'Helsinki']).map((job) => job.slug)).toEqual([
            'frontend',
            'finance-helsinki',
        ]);
    });

    it('combines department and location filters with AND', () => {
        expect(filterJobs(jobs, ['Technology', 'Finance'], ['Woodinville']).map((job) => job.slug))
            .toEqual(['finance-woodinville']);
    });

    it('returns all jobs when no filters are selected', () => {
        expect(filterJobs(jobs, [], [])).toEqual(jobs);
    });

    it('returns no jobs when selected filters do not match', () => {
        expect(filterJobs(jobs, ['Technology'], ['Woodinville'])).toEqual([]);
        expect(filterJobs([], [], [])).toEqual([]);
    });
});

describe('sortByNewest', () => {
    it('orders jobs by posted date, newest first', () => {
        const jobs = [
            makeJob('a', '2027-01-01'),
            makeJob('b', '2027-03-15'),
            makeJob('c', '2027-02-10'),
        ];
        expect(sortByNewest(jobs).map((j) => j.slug)).toEqual(['b', 'c', 'a']);
    });

    it('does not mutate the input array', () => {
        const jobs = [makeJob('a', '2027-01-01'), makeJob('b', '2027-03-15')];
        const original = jobs.map((j) => j.slug);
        sortByNewest(jobs);
        expect(jobs.map((j) => j.slug)).toEqual(original);
    });
});

describe('formatPostedDate', () => {
    it('formats an ISO date as a readable string', () => {
        expect(formatPostedDate('2027-01-05')).toBe('January 5, 2027');
    });

    it('returns the raw value when the date is unparseable', () => {
        expect(formatPostedDate('not-a-date')).toBe('not-a-date');
    });
});
