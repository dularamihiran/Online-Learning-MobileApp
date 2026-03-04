import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CourseCardProps } from '@/types/course';

export default function CourseCard({
  course,
  isEnrolled,
  isEnrolling,
  onPress,
  onEnroll,
}: CourseCardProps) {
  
  const getLevelStyle = () => {
    switch (course.level) {
      case 'Beginner':
        return styles.badgeBeginner;
      case 'Intermediate':
        return styles.badgeIntermediate;
      case 'Advanced':
        return styles.badgeAdvanced;
      default:
        return styles.badgeBeginner;
    }
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.cardContent}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {/* Enrolled Badge (only shown if enrolled) */}
        {isEnrolled && (
          <View style={styles.enrolledBadge}>
            <Ionicons name="checkmark-circle" size={14} color="#fff" />
            <Text style={styles.enrolledBadgeText}>Enrolled</Text>
          </View>
        )}

        {/* Header: Title and Level Badge */}
        <View style={styles.courseHeader}>
          <Text style={styles.courseTitle}>{course.title}</Text>
          {course.level && (
            <View style={[styles.levelBadge, getLevelStyle()]}>
              <Text style={styles.badgeText}>{course.level}</Text>
            </View>
          )}
        </View>

        {/* Instructor Badge */}
        <View style={styles.instructorBadge}>
          <Ionicons name="person" size={12} color="#0ea5e9" />
          <Text style={styles.courseInstructor}>{course.instructor.name}</Text>
        </View>

        {/* Meta Information: Category, Duration, Price */}
        {(course.category || course.duration || course.price) && (
          <View style={styles.metaContainer}>
            {course.category && (
              <View style={styles.metaItem}>
                <Ionicons name="folder-outline" size={12} color="#0ea5e9" />
                <Text style={styles.metaText}>{course.category}</Text>
              </View>
            )}
            {course.duration && (
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={12} color="#0ea5e9" />
                <Text style={styles.metaText}>{course.duration}</Text>
              </View>
            )}
            {course.price && (
              <View style={styles.metaItem}>
                <Ionicons name="pricetag-outline" size={12} color="#0ea5e9" />
                <Text style={styles.metaText}>{course.price}</Text>
              </View>
            )}
          </View>
        )}

        {/* Description */}
        <Text style={styles.description} numberOfLines={3}>
          {course.description}
        </Text>

        {/* Content Preview */}
        {course.content && (
          <View style={styles.contentContainer}>
            <View style={styles.contentLabel}>
              <Ionicons name="document-text-outline" size={14} color="#0ea5e9" />
              <Text style={styles.contentLabelText}>Content Preview</Text>
            </View>
            <Text style={styles.contentText} numberOfLines={2}>
              {course.content}
            </Text>
          </View>
        )}

        {/* View Details Hint (only for enrolled courses) */}
        {isEnrolled && (
          <View style={styles.viewDetailsHint}>
            <Text style={styles.viewDetailsText}>Tap to view full details</Text>
            <Ionicons name="chevron-forward" size={16} color="#0ea5e9" />
          </View>
        )}
      </TouchableOpacity>

      {/* Enroll Button (only shown if not enrolled and onEnroll is provided) */}
      {!isEnrolled && onEnroll && (
        <TouchableOpacity
          style={[
            styles.enrollButton,
            isEnrolling && styles.enrollingButton,
          ]}
          onPress={onEnroll}
          disabled={isEnrolling}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isEnrolling ? "hourglass-outline" : "checkmark-circle"}
            size={18}
            color="#fff"
          />
          <Text style={styles.enrollButtonText}>
            {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  cardContent: {
    // Content wrapper for touchable area
  },
  enrolledBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#6366f1',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  enrolledBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#fff',
  },
  courseHeader: {
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  courseTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#0f172a',
    flex: 1,
    marginRight: 8,
  },
  levelBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeBeginner: {
    backgroundColor: '#d1fae5',
  },
  badgeIntermediate: {
    backgroundColor: '#fed7aa',
  },
  badgeAdvanced: {
    backgroundColor: '#fecaca',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  instructorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  courseInstructor: {
    fontSize: 13,
    color: '#0ea5e9',
    fontWeight: '600',
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  metaText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 21,
    marginBottom: 8,
  },
  contentContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  contentLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  contentLabelText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0ea5e9',
  },
  contentText: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 19,
    marginBottom: 12,
    paddingLeft: 20,
  },
  viewDetailsHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  viewDetailsText: {
    fontSize: 13,
    color: '#0ea5e9',
    fontWeight: '600',
  },
  enrollButton: {
    backgroundColor: '#0ea5e9',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  enrollingButton: {
    backgroundColor: '#7dd3fc',
  },
  enrollButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});
