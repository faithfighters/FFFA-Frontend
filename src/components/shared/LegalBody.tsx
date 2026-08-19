// Renders a legal section's body text from a single admin-edited plain-text
// field: consecutive lines starting with "- " become a bullet list, every
// other non-empty line becomes its own paragraph. Keeps the CMS field model
// to a single textarea per section instead of needing separate list/paragraph
// field types for legal content that's mostly prose with the occasional list.
export default function LegalBody({ text }: { text: string }) {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const blocks: { type: 'p' | 'ul'; items: string[] }[] = [];

    for (const line of lines) {
        const isBullet = line.startsWith('- ');
        const content = isBullet ? line.slice(2) : line;
        const last = blocks[blocks.length - 1];
        if (isBullet && last?.type === 'ul') {
            last.items.push(content);
        } else {
            blocks.push({ type: isBullet ? 'ul' : 'p', items: [content] });
        }
    }

    return (
        <>
            {blocks.map((block, i) =>
                block.type === 'ul' ? (
                    <ul key={i}>
                        {block.items.map((item, j) => <li key={j}>{item}</li>)}
                    </ul>
                ) : (
                    <p key={i}>{block.items[0]}</p>
                )
            )}
        </>
    );
}
