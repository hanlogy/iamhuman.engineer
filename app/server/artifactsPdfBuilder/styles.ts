import { StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
  page: {
    padding: 72,
    fontFamily: 'Helvetica',
    fontSize: 11,
    color: '#1a1a1a',
  },
  pageTitle: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 24,
    marginTop: 0,
    paddingTop: 0,
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
    lineHeight: 1.3,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 8,
  },
  sections: {
    marginTop: 24,
    gap: 18,
  },
  sectionLabel: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 12,
    color: '#666',
  },
  sectionText: {
    fontSize: 10,
    lineHeight: 1.67,
  },
  link: {
    marginBottom: 12,
  },
  linkText: {
    color: '#666',
    fontSize: 10,
    marginBottom: 2,
  },
  linkUrl: {
    fontSize: 10,
    color: '#444',
  },
});
