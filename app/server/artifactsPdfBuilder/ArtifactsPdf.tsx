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
              {tags.length > 0 && (
                <View style={styles.tagsRow}>
                  {tags.map((tag) => (
                    <View key={tag} style={styles.tagChip}>
                      <Text>{tag}</Text>
                    </View>
                  ))}
                </View>
              )}
              <Text style={styles.title}>{title}</Text>

              <View style={styles.sections}>
                <View>
                  <Text style={styles.sectionLabel}>Summary</Text>
                  {summary ? (
                    <Text style={styles.sectionText}>{summary}</Text>
                  ) : (
                    <Text style={styles.sectionEmpty}>Summary is empty</Text>
                  )}
                </View>

                <View>
                  <Text style={styles.sectionLabel}>Judgment</Text>
                  {judgment ? (
                    <Text style={styles.sectionText}>{judgment}</Text>
                  ) : (
                    <Text style={styles.sectionEmpty}>Judgment is empty</Text>
                  )}
                </View>

                <View>
                  <Text style={styles.sectionLabel}>Links</Text>
                  {links.length > 0 ? (
                    links.map(({ text, url }) => (
                      <View key={url} style={styles.link}>
                        {text && <Text style={styles.linkText}>{text}</Text>}
                        <Text style={styles.linkUrl}>{url}</Text>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.sectionEmpty}>Links is empty</Text>
                  )}
                </View>
              </View>
            </View>
          );
        })}
      </Page>
    </Document>
  );
}
