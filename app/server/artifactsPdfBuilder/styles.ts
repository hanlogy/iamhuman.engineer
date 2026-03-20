import { StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 11,
    color: '#1a1a1a',
  },
  pageTitle: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 24,
  },
  artifact: {
    marginBottom: 24,
    paddingBottom: 24,
    borderBottom: '1px solid #e5e5e5',
  },
  artifactLast: {
    marginBottom: 24,
  },
  meta: {
    color: '#666',
    fontSize: 10,
    marginBottom: 10,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 12,
  },
  tagChip: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 9,
    color: '#444',
  },
  title: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 16,
    lineHeight: 1.3,
  },
  sections: {
    gap: 16,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 10,
    color: '#444',
    lineHeight: 1.5,
  },
  sectionEmpty: {
    fontSize: 10,
    color: '#999',
    fontStyle: 'italic',
  },
  link: {
    marginBottom: 8,
  },
  linkText: {
    fontSize: 10,
    marginBottom: 2,
  },
  linkUrl: {
    fontSize: 10,
    color: '#444',
  },
});
