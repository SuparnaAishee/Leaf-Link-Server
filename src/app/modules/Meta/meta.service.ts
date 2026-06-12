import { User } from '../User/user.model';
import { Post } from '../Post/post.model';
import { VerifyProfile } from '../VerifyProfile/verifyProfile.model';
import { USER_STATUS } from '../User/user.constant';

type TActivity = {
  type: 'user' | 'payment' | 'post';
  action: string;
  user: string;
  time: Date;
};

const getAdminStats = async () => {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [
    totalUsers,
    activeUsers,
    premiumUsers,
    totalPosts,
    newUsersThisMonth,
    revenueAgg,
    recentUsers,
    recentPayments,
    recentPosts,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ status: USER_STATUS.ACTIVE }),
    User.countDocuments({ premiumStatus: true }),
    Post.countDocuments(),
    User.countDocuments({ createdAt: { $gte: startOfMonth } }),
    VerifyProfile.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    User.find().sort({ createdAt: -1 }).limit(5).select('name createdAt'),
    VerifyProfile.find({ isPaid: true })
      .sort({ date: -1 })
      .limit(5)
      .populate('user', 'name'),
    Post.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name'),
  ]);

  const totalRevenue = revenueAgg?.[0]?.total || 0;

  // Merge the latest users, payments and posts into one recent-activity feed.
  const activity: TActivity[] = [];

  recentUsers.forEach((u: any) =>
    activity.push({
      type: 'user',
      action: 'New user registered',
      user: u.name,
      time: u.createdAt,
    })
  );
  recentPayments.forEach((p: any) =>
    activity.push({
      type: 'payment',
      action: 'Premium subscription',
      user: p.user?.name || 'Unknown',
      time: p.date,
    })
  );
  recentPosts.forEach((p: any) =>
    activity.push({
      type: 'post',
      action: 'New post created',
      user: p.user?.name || 'Unknown',
      time: p.createdAt,
    })
  );

  activity.sort(
    (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
  );

  return {
    totalUsers,
    activeUsers,
    premiumUsers,
    totalPosts,
    totalRevenue,
    newUsersThisMonth,
    recentActivity: activity.slice(0, 6),
  };
};

export const metaService = { getAdminStats };
