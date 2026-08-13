import { useCallback, useState } from 'react';
import { HeroSection } from './ui/heroSection';
import { StorySection } from './ui/storySection';
import { AboutSection } from './ui/aboutSection';
import { ProjectsSection } from './ui/projectsSection';
import { StackSection } from './ui/stackSection';
import { ContactSection } from './ui/contactSection';
import type { ChartLayout } from '@/shared/data/features';
import type { FeatureId } from '@/shared/types/content';

/**
 * The whole landing page. Feature selection lives here because both the hero
 * switcher and the story section's "Try the …" links drive it.
 */
export const LandingPage = () => {
	const [feature, setFeature] = useState<FeatureId>('charts');
	const [layout, setLayout] = useState<ChartLayout>('sunburst');

	const selectFeature = useCallback((id: FeatureId) => setFeature(id), []);

	return (
		<>
			<HeroSection
				feature={feature}
				layout={layout}
				onSelectFeature={selectFeature}
				onLayout={setLayout}
			/>
			<StorySection onSelectFeature={selectFeature} />
			<AboutSection />
			<ProjectsSection />
			<StackSection />
			<ContactSection />
		</>
	);
};
