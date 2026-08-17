import { formatCurrencyCOP } from '../../lib/format';

const SIZE = 201;
const RADIUS = SIZE / 2;
const LABEL_RADIUS = RADIUS * 0.55;

function polarToCartesian(cx, cy, radius, angleDeg) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + radius * Math.cos(angleRad), y: cy + radius * Math.sin(angleRad) };
}

function describeSlice(cx, cy, radius, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
}

export function MethodChart({ expenses }) {
  const cardTotal = expenses
    .filter((expense) => expense.paymentMethodId === 'card')
    .reduce((sum, expense) => sum + expense.amount, 0);
  const cashTotal = expenses
    .filter((expense) => expense.paymentMethodId === 'cash')
    .reduce((sum, expense) => sum + expense.amount, 0);
  const total = cardTotal + cashTotal;

  const cx = RADIUS;
  const cy = RADIUS;
  const cardAngle = total > 0 ? (cardTotal / total) * 360 : 0;
  const cardLabelPos = polarToCartesian(cx, cy, LABEL_RADIUS, cardAngle / 2);
  const cashLabelPos = polarToCartesian(cx, cy, LABEL_RADIUS, cardAngle + (360 - cardAngle) / 2);

  return (
    <div className="flex h-[240px] w-full flex-col items-center justify-center gap-[21px]">
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        {total > 0 ? (
          <>
            <path d={describeSlice(cx, cy, RADIUS, 0, cardAngle)} className="fill-brand" />
            <path d={describeSlice(cx, cy, RADIUS, cardAngle, 360)} className="fill-ink-secondary" />
            {cardTotal > 0 && (
              <text
                x={cardLabelPos.x}
                y={cardLabelPos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-ink text-[12px] font-bold"
              >
                {formatCurrencyCOP(cardTotal)}
              </text>
            )}
            {cashTotal > 0 && (
              <text
                x={cashLabelPos.x}
                y={cashLabelPos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-ink text-[12px] font-bold"
              >
                {formatCurrencyCOP(cashTotal)}
              </text>
            )}
          </>
        ) : (
          <circle cx={cx} cy={cy} r={RADIUS} className="fill-surface-muted" />
        )}
      </svg>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="size-[18px] shrink-0 rounded-full bg-brand" />
          <span className="text-xs text-muted">Tarjeta débito/crédito</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="size-[18px] shrink-0 rounded-full bg-ink-secondary" />
          <span className="text-xs text-muted">Efectivo</span>
        </div>
      </div>
    </div>
  );
}
