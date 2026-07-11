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

export const deleteCase = (id: string): boolean => {
    const index = cases.findIndex(caseItem => caseItem.id === id);
    if (index !== -1) {
        cases.splice(index, 1);
        return true;
    }
    return false;
};