Sim. Se a refatoração está concluída, **eu não mandaria já para produção**. Agora entramos na fase de **pré-lançamento**: garantir que o site está sólido, seguro e pronto para ser utilizado pelo João.

Eu faria nesta ordem:

### 1. Fechar o `develop` e fazer uma bateria de testes

Primeiro, nada de novas funcionalidades.

Testar **tudo o que já existe**:

* página pública em desktop
* página pública em mobile
* navegação/menu
* galeria
* vídeos
* formulário de contacto
* login `/admin/login`
* proteção das rotas `/admin`
* dashboard
* mensagens
* horários
* gestão da galeria
* gestão dos vídeos
* definições/perfil
* upload/remover avatar
* logout
* refresh das páginas
* sessão expirada
* mensagens de erro

Especialmente testar os casos "maus":

```text
ficheiro demasiado grande
tipo de ficheiro inválido
campos vazios
hora inválida
URL de YouTube inválido
eliminar item
cancelar edição
logout
abrir /admin sem login
```

---

### 2. Rever a segurança do Supabase

Esta é provavelmente **a parte mais importante antes de ficar online**.

Precisamos confirmar:

```text
RLS
 ↓
profiles
gallery_items
videos
schedule
contact_messages
```

e verificar que:

* visitante pode ver apenas aquilo que deve ser público;
* visitante não consegue inserir/alterar/eliminar galeria;
* visitante não consegue alterar vídeos;
* visitante não consegue alterar horários;
* visitante consegue apenas enviar mensagens;
* apenas o admin consegue ler mensagens;
* apenas o admin consegue alterar o próprio perfil;
* Storage `gallery` não permite operações administrativas sem autenticação;
* Storage `videos` idem;
* as RPCs do avatar não podem ser chamadas por `anon`.

Aqui vale mesmo a pena fazermos uma **auditoria final ao SQL/RLS**, porque estar online muda a importância desta parte.

---

### 3. Rever o conteúdo real do site

Agora deixar de olhar para o site como programador e olhar como alguém que acabou de entrar nele.

Precisamos confirmar:

* textos finais;
* história do dojo;
* linhagem;
* filosofia;
* percurso do Kenpo;
* horários;
* localização;
* contactos;
* fotografias;
* vídeos;
* links;
* redes sociais;
* logo;
* favicon;
* títulos das páginas.

E principalmente: **não deixar conteúdo de teste**.

---

### 4. SEO e metadata

Antes do deploy:

```text
<title>
<meta description>
favicon
Open Graph
imagem de partilha
lang="pt-PT"
URLs
```

Por exemplo, quando alguém partilhar o site no WhatsApp, Discord, Facebook, etc., queremos que apareça uma imagem/título/descrição decentes.

Também devemos verificar:

```text
robots.txt
sitemap.xml
```

---

### 5. Performance

Fazer uma passagem pelas imagens e vídeos.

Principalmente:

* imagens demasiado grandes;
* imagens sem compressão;
* vídeos gigantes;
* lazy loading;
* imagens com `width`/`height` adequados;
* carregamento inicial;
* fontes;
* JavaScript desnecessário.

**Vídeos são especialmente importantes**, porque podem tornar o site bastante pesado.

---

### 6. Responsividade

Testar pelo menos:

```text
📱 360px
📱 390px
📱 430px

💻 768px
💻 1024px
💻 1366px
💻 1920px
```

E verificar principalmente:

* navbar;
* hero;
* galeria;
* vídeos;
* horários;
* formulário;
* footer;
* dashboard;
* tabelas/listagens do admin.

---

### 7. Build de produção

Antes do Vercel:

```bash
npm run build
```

Tem de terminar sem erros.

Depois:

```bash
npm run preview
```

E navegar no **build de produção**, não apenas no `npm run dev`.

Isto é importante porque há coisas que funcionam no ambiente de desenvolvimento e podem falhar depois do build.

---

### 8. Configurar corretamente as variáveis de ambiente

Nunca colocar a chave diretamente no código.

Teremos algo deste género:

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

E no Vercel configuramos as mesmas variáveis.

A `anon key` do Supabase pode estar no frontend; **service role key nunca**.

---

### 9. Criar o ambiente de produção no Vercel

Aqui começa finalmente o "online".

A arquitetura será:

```text
GitHub
   ↓
Vercel
   ↓
Vue/Vite
   ↓
Supabase
```

O domínio ainda pode ficar para depois.

Primeiro colocamos o site online através do domínio temporário do Vercel.

---

### 10. Testar o site já online

Isto é **obrigatório**.

Não basta funcionar em localhost.

Testar:

```text
https://...vercel.app
```

e repetir:

* login;
* logout;
* galeria;
* upload;
* vídeos;
* horários;
* mensagens;
* avatar;
* formulário público;
* refresh;
* mobile.

---

### 11. Só depois ligar o domínio

Depois de tudo confirmado:

```text
koloe-koa-dojo.pt
       ↓
     Vercel
       ↓
   site online
```

E aí tratamos dos DNS no Hostinger.

---

### 12. Último checkpoint Git

Antes do deploy eu faria:

```bash
git status
```

Depois:

```bash
git add .
git commit -m "chore: prepare project for production"
git push origin develop
```

E só quando estiver tudo validado:

```text
develop
   ↓
main
   ↓
Vercel
```

---

## Portanto, o nosso próximo passo

Eu faria **agora mesmo uma auditoria final do Supabase/RLS + estrutura do projeto**, antes de mexermos em Vercel.

Depois seguimos:

**Segurança → conteúdo → SEO → performance → responsividade → build → Vercel → testes online → domínio.**

Assim não estamos simplesmente a "mandar o site para a Internet"; estamos a fazer um **release de produção** propriamente dito.
