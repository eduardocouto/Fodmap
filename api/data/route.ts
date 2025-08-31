// This is a placeholder for a Vercel Serverless Function.
// In a real Next.js or SvelteKit project, this file would handle API requests.
// For now, it demonstrates the structure and logic for database interaction.

import { NextResponse } from 'next/server'; // Assuming Next.js-like environment for Vercel
import prisma from '../../db/client'; // Import the singleton prisma client
import type { AppData } from '../../types';

// A mock user ID for demonstration purposes. In a real app, this would
// come from an authentication session (e.g., JWT, session cookie).
const MOCK_USER_ID = "clxkz29g9000008l4hydg56ge"; // Example CUID

/**
 * GET handler to fetch all data for the current user.
 */
export async function GET() {
  try {
    const user = await prisma.user.findUnique({
      where: { id: MOCK_USER_ID },
      include: {
        customFoods: true,
        weeklyPlan: true,
        activities: true,
        bodyCompositions: {
          orderBy: { date: 'desc' },
          take: 1,
        },
        symptomLogs: {
          orderBy: { date: 'desc' },
        },
        medicalDocuments: {
            orderBy: { createdAt: 'desc' }
        },
        medicationLogs: {
            orderBy: { date: 'desc' }
        }
      },
    });

    if (!user) {
      // If user doesn't exist, we could create one or return a default state
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const responseData: AppData = {
      weeklyPlan: (user.weeklyPlan?.planData as any) || {},
      customFoods: user.customFoods.map(food => ({
        ...food,
        fodmaps: food.fodmaps as any, // Cast from Json
      })),
      dailyCalorieGoal: user.dailyCalorieGoal,
      foodPreferences: (user.foodPreferences as any) || {},
      activityData: user.activities.map(act => ({
          ...act,
          date: act.date.toISOString(),
      })),
      bodyCompositionData: user.bodyCompositions[0] ? {
          ...user.bodyCompositions[0],
          date: user.bodyCompositions[0].date.toISOString(),
          normalRanges: user.bodyCompositions[0].normalRanges as any,
      } : null,
      symptomLogs: user.symptomLogs.map(log => ({
          ...log,
          date: log.date.toISOString().split('T')[0],
          urinationFrequency: log.urinationFrequency ?? 0,
          urinationUrgency: log.urinationUrgency ?? 0,
      })),
      medicalDocuments: user.medicalDocuments.map(doc => ({
          ...doc,
          id: doc.id
      })),
      medicationLogs: user.medicationLogs.map(log => ({
          ...log,
          date: log.date.toISOString().split('T')[0],
      }))
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('GET /api/data error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

/**
 * POST handler to save all data for the current user.
 * This demonstrates an "upsert" pattern for the entire app state.
 */
export async function POST(request: Request) {
  try {
    const data: AppData = await request.json();

    const {
      weeklyPlan, customFoods, dailyCalorieGoal, foodPreferences,
      activityData, bodyCompositionData, symptomLogs, medicalDocuments, medicationLogs
    } = data;
    
    await prisma.$transaction([
      prisma.user.update({
        where: { id: MOCK_USER_ID },
        data: { dailyCalorieGoal, foodPreferences: foodPreferences || {} },
      }),
      prisma.weeklyPlan.upsert({
        where: { userId: MOCK_USER_ID },
        create: { userId: MOCK_USER_ID, planData: weeklyPlan || {} },
        update: { planData: weeklyPlan || {} },
      }),

      prisma.foodItem.deleteMany({ where: { userId: MOCK_USER_ID, isCustom: true } }),
      prisma.activity.deleteMany({ where: { userId: MOCK_USER_ID } }),
      prisma.bodyComposition.deleteMany({ where: { userId: MOCK_USER_ID } }),
      prisma.symptomLog.deleteMany({ where: { userId: MOCK_USER_ID } }),
      prisma.medicalDocument.deleteMany({ where: { userId: MOCK_USER_ID } }),
      prisma.medicationLog.deleteMany({ where: { userId: MOCK_USER_ID } }),
      
      prisma.foodItem.createMany({
          data: customFoods.map(food => ({
              ...food,
              fodmaps: food.fodmaps as any, isCustom: true, userId: MOCK_USER_ID,
          }))
      }),
      prisma.activity.createMany({
          data: activityData.map(act => ({ ...act, date: new Date(act.date), userId: MOCK_USER_ID }))
      }),
      ...(bodyCompositionData ? [
            prisma.bodyComposition.create({
                data: {
                    ...bodyCompositionData,
                    date: new Date(bodyCompositionData.date),
                    normalRanges: bodyCompositionData.normalRanges,
                    userId: MOCK_USER_ID,
                }
            })
        ] : []),
      prisma.symptomLog.createMany({
          data: symptomLogs.map(log => ({
              date: new Date(log.date),
              notes: log.notes,
              bloating: log.bloating,
              pain: log.pain,
              energy: log.energy,
              bristolStools: log.bristolStools,
              urinationFrequency: log.urinationFrequency,
              urinationUrgency: log.urinationUrgency,
              userId: MOCK_USER_ID,
          }))
      }),
      prisma.medicalDocument.createMany({
          data: medicalDocuments.map(doc => ({
              fileName: doc.fileName, extractedText: doc.extractedText, userId: MOCK_USER_ID
          }))
      }),
      prisma.medicationLog.createMany({
          data: medicationLogs.map(log => ({
              date: new Date(log.date), name: log.name, dosage: log.dosage,
              frequency: log.frequency, userId: MOCK_USER_ID,
          }))
      })
    ]);

    return NextResponse.json({ message: 'Data saved successfully' }, { status: 200 });
  } catch (error) {
    console.error('POST /api/data error:', error);
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}
