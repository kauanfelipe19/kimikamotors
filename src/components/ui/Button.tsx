import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/cn';
import { classesBotao, type EstiloBotao } from './estilos';

type ButtonProps = EstiloBotao & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  variante,
  tamanho,
  larguraTotal,
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(classesBotao({ variante, tamanho, larguraTotal }), className)}
      {...props}
    />
  );
}

type ButtonLinkProps = EstiloBotao &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
    /** Rota interna (usa o React Router) */
    to?: string;
    /** Link externo (abre em nova aba) */
    href?: string;
    children: ReactNode;
  };

export function ButtonLink({
  variante,
  tamanho,
  larguraTotal,
  className,
  to,
  href,
  children,
  ...props
}: ButtonLinkProps) {
  const classes = cn(classesBotao({ variante, tamanho, larguraTotal }), className);
  if (to)
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...props}>
      {children}
    </a>
  );
}
