import { useId, useMemo, useState } from 'react'

export function Spinner({ size = 'md', className = '' }) {
  const tamanos = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-7 w-7',
  }

  return (
    <svg
      viewBox="0 0 24 24"
      className={`animate-spin ${tamanos[size] || tamanos.md} ${className}`}
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 0 1 8-8v3a5 5 0 0 0-5 5H4z"
      />
    </svg>
  )
}

const estilosBoton = {
  base:
    'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-cotecmar-steel/40 disabled:opacity-60 disabled:cursor-not-allowed',
  primary:
    'bg-cotecmar-steel text-white hover:bg-cotecmar-steel/90 active:bg-cotecmar-steel/80',
  secondary:
    'bg-white text-cotecmar-navy border border-slate-200 hover:bg-slate-50 active:bg-slate-100',
  danger:
    'bg-cotecmar-error text-white hover:bg-cotecmar-error/90 active:bg-cotecmar-error/80',
  ghost:
    'bg-transparent text-cotecmar-steel hover:bg-cotecmar-steel/10 active:bg-cotecmar-steel/15',
}

export function Boton({
  variant = 'primary',
  loading = false,
  disabled = false,
  className = '',
  children,
  ...props
}) {
  const deshabilitado = disabled || loading

  return (
    <button
      {...props}
      disabled={deshabilitado}
      className={`${estilosBoton.base} ${estilosBoton[variant] || estilosBoton.primary} ${className}`}
    >
      {loading && <Spinner size="sm" className="opacity-90" />}
      {children}
    </button>
  )
}

function IconoOjo({ visible }) {
  return visible ? (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 5c6 0 10 7 10 7s-4 7-10 7S2 12 2 12s4-7 10-7Zm0 2c-4.2 0-7.3 4.2-8.6 5.9C4.7 14.6 7.8 19 12 19s7.3-4.4 8.6-6.1C19.3 11.2 16.2 7 12 7Zm0 2.5A3.5 3.5 0 1 1 8.5 13 3.5 3.5 0 0 1 12 9.5Z"
      />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="currentColor"
        d="M3.3 2.3 2 3.6l3 3C3 8.7 2 10.8 2 12c0 0 4 7 10 7 2 0 3.8-.5 5.3-1.3l3.1 3.1 1.3-1.3L3.3 2.3ZM12 17c-4.2 0-7.3-4.4-8.6-6.1.5-.8 1.4-2.2 2.8-3.4l2.2 2.2A3.5 3.5 0 0 0 14.3 16l1.6 1.6c-1.1.3-2.4.4-3.9.4Zm8.6-4.1c-.6 1-1.7 2.6-3.2 3.8l-2.1-2.1a3.5 3.5 0 0 0-4.9-4.9L8.2 7.5C9.3 7.2 10.6 7 12 7c4.2 0 7.3 4.2 8.6 5.9Z"
      />
    </svg>
  )
}

function CampoBase({
  id,
  label,
  error,
  iconLeft,
  rightElement,
  children,
  disabled,
}) {
  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-slate-700"
        >
          {label}
        </label>
      )}

      <div
        className={
          `relative rounded-md border bg-white transition duration-200 ease-in-out ` +
          `focus-within:ring-2 focus-within:ring-cotecmar-steel/25 ` +
          `${error ? 'border-cotecmar-error' : 'border-slate-200'} ` +
          `${disabled ? 'opacity-70 cursor-not-allowed' : ''}`
        }
      >
        {iconLeft && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            {iconLeft}
          </div>
        )}

        {children}

        {rightElement && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 text-slate-500">
            {rightElement}
          </div>
        )}
      </div>

      {error && <p className="text-xs text-cotecmar-error">{error}</p>}
    </div>
  )
}

export function Input({
  label,
  error,
  iconLeft,
  className = '',
  type = 'text',
  disabled = false,
  ...props
}) {
  const autoId = useId()
  const id = props.id || autoId

  const esPassword = type === 'password'
  const [visible, setVisible] = useState(false)

  const tipoFinal = esPassword ? (visible ? 'text' : 'password') : type

  const rightElement = useMemo(() => {
    if (!esPassword) return null

    return (
      <button
        type="button"
        onClick={() => setVisible(v => !v)}
        disabled={disabled}
        className="rounded-md px-2 py-1 text-slate-500 hover:text-slate-700 transition duration-200 ease-in-out disabled:cursor-not-allowed"
        aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
      >
        <IconoOjo visible={visible} />
      </button>
    )
  }, [disabled, esPassword, visible])

  return (
    <CampoBase
      id={id}
      label={label}
      error={error}
      iconLeft={iconLeft}
      rightElement={rightElement}
      disabled={disabled}
    >
      <input
        {...props}
        id={id}
        type={tipoFinal}
        disabled={disabled}
        className={
          `w-full bg-transparent px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 ` +
          `${iconLeft ? 'pl-10' : ''} ` +
          `${esPassword ? 'pr-10' : ''} ` +
          `${disabled ? 'cursor-not-allowed' : ''} ` +
          `${className}`
        }
      />
    </CampoBase>
  )
}

export function Select({
  label,
  error,
  className = '',
  disabled = false,
  children,
  ...props
}) {
  const autoId = useId()
  const id = props.id || autoId

  return (
    <CampoBase id={id} label={label} error={error} disabled={disabled}>
      <select
        {...props}
        id={id}
        disabled={disabled}
        className={
          `w-full appearance-none bg-transparent px-3 py-2 pr-10 text-sm text-slate-900 outline-none ` +
          `${disabled ? 'cursor-not-allowed' : ''} ` +
          `${className}`
        }
      >
        {children}
      </select>

      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
          <path fill="currentColor" d="M7 10l5 5 5-5H7z" />
        </svg>
      </div>
    </CampoBase>
  )
}

export function Textarea({
  label,
  error,
  className = '',
  disabled = false,
  ...props
}) {
  const autoId = useId()
  const id = props.id || autoId

  return (
    <CampoBase id={id} label={label} error={error} disabled={disabled}>
      <textarea
        {...props}
        id={id}
        disabled={disabled}
        className={
          `w-full bg-transparent px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 resize-none ` +
          `${disabled ? 'cursor-not-allowed' : ''} ` +
          `${className}`
        }
      />
    </CampoBase>
  )
}

const estilosAlerta = {
  base: 'relative rounded-md border px-4 py-3 text-sm',
  success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-amber-50 border-amber-200 text-amber-900',
  info: 'bg-slate-50 border-slate-200 text-slate-800',
}

function IconoAlerta({ variant }) {
  const className = 'h-5 w-5'

  if (variant === 'success') {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path
          fill="currentColor"
          d="M9.2 16.2 5.7 12.7l1.4-1.4 2.1 2.1 7.6-7.6 1.4 1.4-9 9Z"
        />
      </svg>
    )
  }

  if (variant === 'error') {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 13h-2v-2h2v2Zm0-4h-2V7h2v4Z"
        />
      </svg>
    )
  }

  if (variant === 'warning') {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 2 1 21h22L12 2Zm1 15h-2v-2h2v2Zm0-4h-2V9h2v4Z"
        />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 15h-2v-6h2v6Zm0-8h-2V7h2v2Z"
      />
    </svg>
  )
}

export function Alerta({
  variant = 'info',
  onCerrar,
  children,
  className = '',
}) {
  return (
    <div className={`${estilosAlerta.base} ${estilosAlerta[variant] || estilosAlerta.info} ${className}`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5">
          <IconoAlerta variant={variant} />
        </div>
        <div className="flex-1">{children}</div>
        {onCerrar && (
          <button
            type="button"
            onClick={onCerrar}
            className="-mr-1 -mt-1 rounded-md p-1 text-current/60 hover:text-current transition duration-200 ease-in-out"
            aria-label="Cerrar alerta"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
              <path fill="currentColor" d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7 4.3 4.3l6.3 6.3 6.3-6.3 1.4 1.4Z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

export function Badge({ value, className = '' }) {
  const { texto, clases } = useMemo(() => {
    if (value === 'pendiente') {
      return { texto: 'Pendiente', clases: 'bg-amber-50 text-amber-900 border-amber-200' }
    }
    if (value === 'fabricada') {
      return { texto: 'Fabricada', clases: 'bg-emerald-50 text-emerald-800 border-emerald-200' }
    }

    if (typeof value === 'number') {
      return { texto: String(value), clases: 'bg-slate-50 text-slate-700 border-slate-200' }
    }

    return { texto: String(value ?? ''), clases: 'bg-slate-50 text-slate-700 border-slate-200' }
  }, [value])

  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${clases} ${className}`}
    >
      {texto}
    </span>
  )
}
