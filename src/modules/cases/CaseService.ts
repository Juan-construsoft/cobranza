import { Case } from '../../types';

const cases: Case[] = [];

export const createCase = (newCase: Case): Case => {
    cases.push(newCase);
    return newCase;
};

export const getCases = (): Case[] => {
    return cases;
};

export const getCaseById = (id: string): Case | undefined => {
    return cases.find(caseItem => caseItem.id === id);
};

export const updateCase = (id: string, updatedCase: Partial<Case>): Case | undefined => {
    const index = cases.findIndex(caseItem => caseItem.id === id);
    if (index !== -1) {
        cases[index] = { ...cases[index], ...updatedCase };
        return cases[index];
    }
    return undefined;
};

export const getActiveCases = (): number => {
    return cases.filter(caseItem => caseItem.status === 'Active').length;
};

export const getCasesByStatus = (): Record<string, number> => {
    return cases.reduce<Record<string, number>>((acc, caseItem) => {
        acc[caseItem.status] = (acc[caseItem.status] ?? 0) + 1;
        return acc;
    }, {});
};

export const deleteCase = (id: string): boolean => {
    const index = cases.findIndex(caseItem => caseItem.id === id);
    if (index !== -1) {
        cases.splice(index, 1);
        return true;
    }
    return false;
};