-- CreateEnum
CREATE TYPE "ReadingPlanStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'ABANDONED');

-- CreateEnum
CREATE TYPE "AchievementType" AS ENUM ('PLAN_COMPLETED_TOTAL', 'PLAN_COMPLETED_SPECIFIC', 'PLAN_SUBSCRIBED_TOTAL', 'BIBLE_COMPLETED');

-- CreateTable
CREATE TABLE "ReadingPlanRun" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "planSlug" TEXT NOT NULL,
    "iteration" INTEGER NOT NULL DEFAULT 1,
    "status" "ReadingPlanStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "currentDay" INTEGER NOT NULL DEFAULT 1,
    "totalDays" INTEGER,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "lastActivityAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReadingPlanRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAchievement" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "AchievementType" NOT NULL,
    "planSlug" TEXT,
    "count" INTEGER NOT NULL DEFAULT 0,
    "lastEarnedAt" TIMESTAMP(3),

    CONSTRAINT "UserAchievement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ReadingPlanRun_userId_planSlug_idx" ON "ReadingPlanRun"("userId", "planSlug");

-- CreateIndex
CREATE INDEX "ReadingPlanRun_userId_status_idx" ON "ReadingPlanRun"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "UserAchievement_userId_type_planSlug_key" ON "UserAchievement"("userId", "type", "planSlug");

-- AddForeignKey
ALTER TABLE "ReadingPlanRun" ADD CONSTRAINT "ReadingPlanRun_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAchievement" ADD CONSTRAINT "UserAchievement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
