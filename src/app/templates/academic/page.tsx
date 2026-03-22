'use client';
import { useEffect, useState } from 'react';
import { AcademicTemplate } from "@/components/templates/AcademicTemplate";
import { loadDraft } from '@/lib/pitchStore';

const mockAcademicData = {
  title: "Impacto da Computação Quântica em Algoritmos de Criptografia Assimétrica",
  subtitle: "Uma Análise Comparativa dos Protocolos Pós-Quânticos CRYSTALS-Kyber e NTRU em Ambientes de Nuvem Distribuída",
  author: "Dra. Beatriz Sousa Ferreira",
  institution: "UNIVERSIDADE FEDERAL DE MINAS GERAIS",
  department: "Departamento de Ciência da Computação — Programa de Pós-Graduação em Segurança Digital",
  advisor: "Prof. Dr. Marcelo Antunes Vieira",
  abstract: "Esta pesquisa investiga a vulnerabilidade dos sistemas de criptografia RSA e ECC frente ao advento da computação quântica de escala prática. Através de simulações com emuladores quânticos Qiskit e benchmarks em infraestrutura de nuvem híbrida, o estudo propõe uma arquitetura de migração gradual para protocolos pós-quânticos que mantém compatibilidade retroativa com sistemas legados, reduzindo o custo de transição estimado em 63%.",
  year: 2025,
  chapters: [
    {
      title: "Fundamentos da Ameaça Quântica",
      content: "O algoritmo de Shor, quando executado em hardware quântico com suficiente número de qubits estáveis, é capaz de fatorar números inteiros em tempo polinomial — comprometendo diretamente a segurança de sistemas RSA-2048 e acima. Este capítulo contextualiza o estado atual do desenvolvimento de processadores quânticos e os horizontes reais da ameaça.",
      keywords: ["Algoritmo de Shor", "RSA", "Qubits", "Ameaça Quântica"]
    },
    {
      title: "Protocolos Pós-Quânticos: Estado da Arte",
      content: "Análise detalhada dos finalistas do processo de padronização do NIST para criptografia pós-quântica: CRYSTALS-Kyber (KEM), CRYSTALS-Dilithium (assinaturas) e SPHINCS+. O capítulo avalia desempenho, tamanho de chave e custo computacional em comparação com protocolos clássicos.",
      keywords: ["CRYSTALS-Kyber", "NIST PQC", "Lattice Cryptography", "KEM"]
    },
    {
      title: "Proposta de Arquitetura de Migração Híbrida",
      content: "Apresentação do framework MigraCrypt, capaz de operar em modo duplo (clássico + pós-quântico) durante o período de transição. Resultados em ambiente de produção demonstram overhead de latência inferior a 8ms em operações TLS 1.3, viabilizando adoção imediata em sistemas bancários e de saúde.",
      keywords: ["Migração Híbrida", "TLS 1.3", "MigraCrypt", "Compatibilidade"]
    }
  ],
  references: [
    "Shor, P.W. (1994). Algorithms for Quantum Computation: Discrete Logarithms and Factoring. FOCS.",
    "NIST (2022). Post-Quantum Cryptography Standardization — Final Report.",
    "Ferreira, B.S. & Vieira, M.A. (2024). MigraCrypt: Hybrid Transition Framework for PQC Adoption.",
    "Bernstein, D.J. & Lange, T. (2017). Post-quantum Cryptography. Nature."
  ]
};

export default function AcademicPreview() {
  const [data, setData] = useState(mockAcademicData);
  useEffect(() => {
    const draft = loadDraft();
    if (!draft) return;
    setData(prev => ({ ...prev, author: draft.fullName, abstract: draft.description }));
  }, []);
  return <AcademicTemplate data={data} />;
}
