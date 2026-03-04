export type Course = {
  _id: string;
  title: string;
  description: string;
  content?: string;
  category?: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
  duration?: string;
  price?: string;
  instructor: {
    _id: string;
    name: string;
  };
};

export type CourseCardProps = {
  course: Course;
  isEnrolled: boolean;
  isEnrolling: boolean;
  onPress: () => void;
  onEnroll?: () => void;
};
