import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect } from 'vitest';
import ProjectCard from '../components/ProjectCard.astro';
import Projects from '../components/Projects.astro';
import Skills from '../components/Skills.astro';
import AboutMe from '../components/AboutMe.astro';
import Contact from '../components/Contact.astro';

const baseProjectProps = {
  title: 'Test Project',
  outStanding: true,
  description: 'A test project description.',
  features: ['Feature 1', 'Feature 2'],
  technologies: ['Astro', 'TailwindCSS'],
  status: true,
  imageUrl: '/test-image.webp',
  projectUrl: 'https://example.com',
};

describe('ProjectCard.astro', () => {
  it('renders title, features, and technologies', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(ProjectCard, { props: baseProjectProps });
    expect(html).toContain('Test Project');
    expect(html).toContain('Feature 1');
    expect(html).toContain('Astro');
  });
  it('shows the Destacado pill if outStanding', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(ProjectCard, { props: baseProjectProps });
    expect(html).toContain('Destacado');
  });
});

describe('Projects.astro', () => {
  it('renders at least one ProjectCard', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Projects);
    expect(html).toContain('McpServerMongodb'); // Project title from fixture
  });
});

describe('Skills.astro', () => {
  it('renders SVG icons grid', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Skills);
    expect(html).toContain('habilidades');
    expect(html).toContain('.svg');
  });
});

describe('AboutMe.astro', () => {
  it('renders profile and contact links', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(AboutMe);
    expect(html).toContain('perfil.dev');
    expect(html).toMatch(/linkedin/i);
  });
});

describe('Contact.astro', () => {
  it('renders contact form and info', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Contact);
    expect(html).toContain('contacto');
    expect(html).toContain('Construyamos algo increíble');
  });
});

// API test for contact endpoint
import { POST } from '../pages/api/contact.ts';

describe('API: /api/contact', () => {
  it('returns 303 redirect for valid POST', async () => {
    // Simulate Astro request with formData
    const form = new FormData();
    form.append('name', 'Test');
    form.append('email', 'test@example.com');
    form.append('message', 'Hello');
    const request = new Request('http://localhost/api/contact', { method: 'POST', body: form });
    // @ts-ignore: clientAddress is optional in Astro context
    const response = await POST({ request, clientAddress: '127.0.0.1' });
    expect(response.status).toBe(303);
    const location = response.headers.get('Location');
    expect(location).toMatch(/\?/);
  });
});
