"use server";
import { db } from "@/db";
import { getCurrentUser } from "./users";

export async function getOrganizations() {
  const { currentUser } = await getCurrentUser();

  const members = await db.member.findMany({
    where: {
      userId: currentUser.id,
    },
    select: {
      organizationId: true,
    },
  });

  const organizations = await db.organization.findMany({
    where: {
      id: {
        in: members.map((member: { organizationId: string }) => member.organizationId),
      },
    },
  });

  return organizations;
}

export async function getActiveOrganization(userId: string) {
  const memberUser = await db.member.findFirst({
    where: {
      userId: userId,
    },
  });

  if (!memberUser) {
    return null;
  }

  const activeOrganization = await db.organization.findFirst({
    where: {
      id: memberUser.organizationId,
    },
  });

  return activeOrganization;
}

export async function getOrganizationBySlug(slug: string) {
  try {
    const organizationBySlug = await db.organization.findFirst({
      where: {
        slug: slug,
      },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    return organizationBySlug;
  } catch (error) {
    console.error(error);
    return null;
  }
}
