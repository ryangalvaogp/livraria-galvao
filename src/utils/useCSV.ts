import crypto from 'crypto';
import { AchievementProps } from '../types/achievementControllerstTypes';
import cJ from 'csvtojson';
import { connection } from '../database/connection';
import { Book, BookProps } from '../types/booksControllers';

type CSVFileType = 'books' | 'achievement'

export default async function useCVS(pathCSV: string, type: CSVFileType) {
    const json = await cJ().fromFile(pathCSV);

    if (type == 'achievement') return formatAchievements(json);
    if (type == 'books') return formatBooks(json);
}

async function formatAchievements(jsonConquistas: AchievementProps[]) {
    const valuesAchievementCSV = jsonConquistas.map((achievement: AchievementProps) => {
        const id = crypto.randomBytes(4).toString('hex');
        const isActive = true;//This could be in global config

        return {
            id,
            title: achievement.title,
            type: achievement.type,
            reward: achievement.reward,
            amount: Number(achievement.amount),
            isActive,
        }
    });

    return valuesAchievementCSV;
}

async function formatBooks(jsonBooks: BookProps['create']['crud']['tableBook'][]) {
    const valuesBookCSV = jsonBooks.map((book) => {
        const id = crypto.randomBytes(4).toString('hex');
        let title = book.title.replace('\n', '');

        // delete book.amount
        // delete book.factoryPrice
        // delete book.salePrice

        return {
            
            ...book,
            title,
            id,
            // isbn: book.isbn.split(', '),
            pages: Number(book.pages),
            cddcdu:Number(book.cddcdu),
            likes:0,
            amount: Number(book.amount),
            //salePrice: Number(book.salePrice),
            //factoryPrice: Number(book.factoryPrice),
            editionNumber:Number(book.editionNumber),
        }
    });

    return valuesBookCSV;
};