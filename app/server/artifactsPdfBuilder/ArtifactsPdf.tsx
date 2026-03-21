import { Document, Page, Text, View } from '@react-pdf/renderer';
import type { Artifact } from '@/definitions';
import { artifactTypeToLabel } from '@/helpers/artifactTypeToLabel';
import { styles } from './styles';

export type ExportedArtifact = Omit<
  Artifact,
  'artifactId' | 'userId' | 'tags'
> & {
  tags: readonly string[];
};

export function ArtifactsPdf({
  artifacts,
  name,
}: {
  artifacts: ExportedArtifact[];
  name?: string;
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.pageTitle}>
          {name ? `${name} - Artifacts` : 'Artifacts'}
        </Text>
        {artifacts.map((artifact, i) => {
          const { title, type, releaseDate, tags, summary, judgment, links } =
            artifact;

          return (
            <View
              key={i}
              style={
                i < artifacts.length - 1 ? styles.artifact : styles.artifactLast
              }
            >
              <Text style={styles.meta}>
                {artifactTypeToLabel(type)} · Released {releaseDate}
              </Text>
              <Text style={styles.title}>{title}</Text>
              {tags.length > 0 && (
                <View style={styles.tagsRow}>
                  {tags.map((tag) => (
                    <View key={tag} style={styles.tagChip}>
                      <Text>{tag}</Text>
                    </View>
                  ))}
                </View>
              )}

              <View style={styles.sections}>
                {summary && (
                  <View>
                    <Text style={styles.sectionLabel}>SUMMARY</Text>
                    <Text style={styles.sectionText}>{summary}</Text>
                  </View>
                )}

                {judgment && (
                  <View>
                    <Text style={styles.sectionLabel}>JUDGMENT</Text>
                    <Text style={styles.sectionText}>{judgment}</Text>
                  </View>
                )}

                {links.length > 0 && (
                  <View>
                    <Text style={styles.sectionLabel}>LINKS</Text>
                    {links.map(({ text, url }) => (
                      <View key={url} style={styles.link}>
                        {text && <Text style={styles.linkText}>{text}</Text>}
                        <Text style={styles.linkUrl}>{url}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </Page>
    </Document>
  );
}
