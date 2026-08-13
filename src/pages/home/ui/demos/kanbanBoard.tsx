import { memo, useCallback, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import {
	DragDropContext,
	Draggable,
	Droppable,
	type DraggableProvided,
	type DropResult,
} from '@hello-pangea/dnd';
import { areEqual, FixedSizeList, type ListChildComponentProps } from 'react-window';
import { useElementSize } from '@/shared/hooks/useElementSize';

const FIRST = ['Rosa', 'Thanh', 'Jae', 'Meera', 'Aigerim', 'Daniyar', 'Nurlan', 'Alina', 'Timur', 'Saule', 'Yerlan', 'Dina', 'Marat', 'Kamila', 'Ruslan', 'Zhanna'];
const LAST = ['Alvarez', 'Ngo', 'Park', 'Kaur', 'Serik', 'Ibrayev', 'Toleu', 'Muratova', 'Kim', 'Abenov', 'Sadykova', 'Orazov', 'Bekova', 'Iskakov', 'Nurpeisova', 'Zhaksylyk'];
const ROLES = ['Frontend engineer', 'Data analyst', 'Product designer', 'QA engineer', 'Store manager', 'Courier', 'Recruiter', 'Backend engineer'];

const CARD_H = 62;
const GAP = 8;
const ROW_H = CARD_H + GAP;

interface Item {
	id: string;
	name: string;
	role: string;
	score: number;
}

type Columns = Record<string, Item[]>;

const COLUMN_META = [
	{ id: 'screening', name: 'Screening' },
	{ id: 'interview', name: 'Interview' },
	{ id: 'offer', name: 'Offer' },
] as const;

const buildColumns = (total: number): Columns => {
	const cols: Columns = { screening: [], interview: [], offer: [] };
	for (let i = 0; i < total; i++) {
		const target = i % 17 === 0 ? 'offer' : i % 5 === 0 ? 'interview' : 'screening';
		cols[target].push({
			id: `card-${i}`,
			name: `${FIRST[i % FIRST.length]} ${LAST[(i * 7 + 3) % LAST.length]}`,
			role: ROLES[(i * 3) % ROLES.length],
			score: 40 + ((i * 37) % 60),
		});
	}
	return cols;
};

const CandidateCard = ({ item, isDragging }: { item: Item; isDragging: boolean }) => (
	<div
		style={{
			height: CARD_H,
			borderRadius: 'var(--radius-md)',
			background: 'var(--glass-bg)',
			border: `1px solid ${isDragging ? 'color-mix(in oklab, var(--primary) 55%, transparent)' : 'var(--glass-border)'}`,
			boxShadow: isDragging ? 'var(--glass-shadow-lg)' : 'inset 0 1px 0 0 var(--glass-hairline)',
			padding: '9px 11px',
			display: 'flex',
			flexDirection: 'column',
			gap: 3,
			cursor: isDragging ? 'grabbing' : 'grab',
			userSelect: 'none',
			transform: isDragging ? 'rotate(-1.4deg) scale(1.02)' : undefined,
		}}
	>
		<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
			<span
				style={{
					font: '500 12.5px/1.3 var(--font-sans)',
					color: 'var(--foreground)',
					whiteSpace: 'nowrap',
					overflow: 'hidden',
					textOverflow: 'ellipsis',
				}}
			>
				{item.name}
			</span>
			<span style={{ font: '400 11px/1.4 var(--font-mono)', color: 'var(--primary)' }}>{item.score}</span>
		</div>
		<span
			style={{
				font: '400 11.5px/1.4 var(--font-sans)',
				color: 'var(--muted-foreground)',
				whiteSpace: 'nowrap',
				overflow: 'hidden',
				textOverflow: 'ellipsis',
			}}
		>
			{item.role}
		</span>
	</div>
);

interface RowData {
	items: Item[];
}

const combineStyles = (
	virtualStyle: CSSProperties,
	provided: DraggableProvided,
): CSSProperties => ({
	...virtualStyle,
	...provided.draggableProps.style,
});

const Row = memo(({ index, style, data }: ListChildComponentProps<RowData>) => {
	const item = data.items[index] as Item | undefined;
	// The extra slot react-window renders while a card from another column
	// hovers over this one (dnd placeholder) has no item behind it.
	if (item === undefined) return null;

	return (
		<Draggable draggableId={item.id} index={index} key={item.id}>
			{(provided, snapshot) => (
				<div
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					style={combineStyles(style, provided)}
				>
					<div style={{ padding: `0 0 ${GAP}px` }}>
						<CandidateCard item={item} isDragging={snapshot.isDragging} />
					</div>
				</div>
			)}
		</Draggable>
	);
}, areEqual);

interface ColumnProps {
	id: string;
	name: string;
	items: Item[];
	onRendered: (id: string, count: number) => void;
}

const Column = ({ id, name, items, onRendered }: ColumnProps) => {
	const { ref, size } = useElementSize<HTMLDivElement>();
	const itemData = useMemo(() => ({ items }), [items]);

	return (
		<Droppable
			droppableId={id}
			mode="virtual"
			renderClone={(provided, snapshot, rubric) => (
				<div
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					style={provided.draggableProps.style}
				>
					<CandidateCard item={items[rubric.source.index]} isDragging={snapshot.isDragging} />
				</div>
			)}
		>
			{(droppableProvided, droppableSnapshot) => {
				const isOver = droppableSnapshot.isDraggingOver;
				// While a card hovers over this column, dnd needs one extra
				// virtual slot for the placeholder space.
				const itemCount = droppableSnapshot.isUsingPlaceholder ? items.length + 1 : items.length;
				return (
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							minHeight: 0,
							minWidth: 0,
							borderRadius: 'var(--radius-lg)',
							background: isOver
								? 'color-mix(in oklab, var(--primary) 7%, var(--glass-bg-subtle))'
								: 'var(--glass-bg-subtle)',
							border: `1px solid ${isOver ? 'color-mix(in oklab, var(--primary) 55%, transparent)' : 'var(--border)'}`,
							overflow: 'hidden',
							transition: 'background 140ms var(--ease-glass), border-color 140ms var(--ease-glass)',
						}}
					>
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
								gap: 8,
								padding: '9px 11px',
								borderBottom: '1px solid var(--border)',
								flex: 'none',
							}}
						>
							<span
								style={{
									font: '550 11.5px/1.3 var(--font-sans)',
									letterSpacing: '0.04em',
									textTransform: 'uppercase',
									color: isOver ? 'var(--primary)' : 'var(--muted-foreground)',
								}}
							>
								{isOver ? 'Drop here' : name}
							</span>
							<span style={{ font: '400 11px/1.4 var(--font-mono)', color: 'var(--muted-foreground)' }}>
								{items.length.toLocaleString('en-US')}
							</span>
						</div>
						<div ref={ref} style={{ minHeight: 0, flex: 1, padding: '8px 8px 0' }}>
							<FixedSizeList
								height={Math.max(size.height - 8, 0)}
								width="100%"
								itemCount={itemCount}
								itemSize={ROW_H}
								itemData={itemData}
								itemKey={(index, data) => data.items[index]?.id ?? 'placeholder'}
								outerRef={droppableProvided.innerRef}
								overscanCount={4}
								onItemsRendered={({ overscanStartIndex, overscanStopIndex }) =>
									onRendered(id, overscanStopIndex - overscanStartIndex + 1)
								}
							>
								{Row}
							</FixedSizeList>
						</div>
					</div>
				);
			}}
		</Droppable>
	);
};

/**
 * Virtualized kanban on @hello-pangea/dnd + react-window (the same pattern as
 * the Support Desk board): virtual droppables with a render clone, smooth
 * placeholder gaps while dragging, and drops landing at the hovered index.
 */
export const KanbanBoard = ({
	count = 1200,
	onReadout,
}: {
	count?: number;
	onReadout?: (s: string) => void;
}) => {
	const [columns, setColumns] = useState<Columns>(() => buildColumns(count));
	const rendered = useRef<Record<string, number>>({});
	const readoutRef = useRef(onReadout);
	readoutRef.current = onReadout;

	const report = useCallback(
		(colId: string, renderedCount: number) => {
			rendered.current[colId] = renderedCount;
			const inDom = Object.values(rendered.current).reduce((a, b) => a + b, 0);
			readoutRef.current?.(`${count.toLocaleString('en-US')} cards · ${inDom} in the DOM`);
		},
		[count],
	);

	const onDragEnd = useCallback((result: DropResult) => {
		const { source, destination } = result;
		if (!destination) return;
		if (source.droppableId === destination.droppableId && source.index === destination.index) {
			return;
		}
		setColumns((prev) => {
			const next: Columns = { ...prev };
			const fromList = [...next[source.droppableId]];
			const [moved] = fromList.splice(source.index, 1);
			if (source.droppableId === destination.droppableId) {
				fromList.splice(destination.index, 0, moved);
				next[source.droppableId] = fromList;
			} else {
				const toList = [...next[destination.droppableId]];
				// Land exactly where the gap opened — no forced "always first".
				toList.splice(destination.index, 0, moved);
				next[source.droppableId] = fromList;
				next[destination.droppableId] = toList;
			}
			return next;
		});
	}, []);

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<div
				className="kanban-grid"
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
					gap: 10,
					height: '100%',
					padding: 2,
				}}
			>
				{COLUMN_META.map((meta) => (
					<Column
						key={meta.id}
						id={meta.id}
						name={meta.name}
						items={columns[meta.id]}
						onRendered={report}
					/>
				))}
			</div>
		</DragDropContext>
	);
};
