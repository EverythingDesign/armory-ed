gsap.registerPlugin(ScrollTrigger);function createRadialTransition(g,d,p,$){const n=document.querySelector(g);if(!n)return;function u(e){return e<.5?2*e*e:-1+(4-2*e)*e}const s=e=>{const t=u(e),o=t*.82,l=18+t*16,i=-2-(1-t)*8,c=t*.52,r=30+t*28,b=t*.22,h=window.innerHeight/window.innerWidth,a=Math.max(1,h*1.2),w=55*a,m=125*a,f=160*a;n.style.background=`
      radial-gradient(ellipse ${w}% ${l}% at 50% ${i}%,
        rgba(255,148,45,${o}) 0%,
        rgba(200,72,12,${o*.5}) 45%,
        transparent 75%),
      radial-gradient(ellipse ${m}% ${r}% at 50% ${i-8}%,
        rgba(170,50,8,${c}) 0%,
        rgba(80,20,3,${c*.4}) 55%,
        transparent 85%),
      radial-gradient(ellipse ${f}% 65% at 50% -25%,
        rgba(100,28,5,${b}) 0%,
        transparent 80%)
    `};s(0),ScrollTrigger.create({trigger:d,start:p,end:$,scrub:!0,onUpdate:e=>{s(e.progress)}})}function createRadialTransitionFromBottom(g,d,p,$){const n=document.querySelector(g);if(!n)return;function u(e){return e<.5?2*e*e:-1+(4-2*e)*e}const s=e=>{const t=u(e),o=t*.82,l=18+t*16,i=95+(1-t)*15,c=t*.52,r=30+t*28,b=t*.22,h=window.innerHeight/window.innerWidth,a=Math.max(1,h*1.2),w=55*a,m=125*a,f=160*a;n.style.background=`
      radial-gradient(ellipse ${w}% ${l}% at 50% ${i}%,
        rgba(255,148,45,${o}) 0%,
        rgba(200,72,12,${o*.5}) 45%,
        transparent 75%),
      radial-gradient(ellipse ${m}% ${r}% at 50% ${i+12}%,
        rgba(170,50,8,${c}) 0%,
        rgba(80,20,3,${c*.4}) 55%,
        transparent 85%),
      radial-gradient(ellipse ${f}% 65% at 50% 125%,
        rgba(100,28,5,${b}) 0%,
        transparent 80%)
    `};s(0),ScrollTrigger.create({trigger:d,start:p,end:$,scrub:!0,onUpdate:e=>{s(e.progress)}})}function createRadialTransitionFromCenter(g,d,p,$){const n=document.querySelector(g);if(!n)return;function u(e){return e<.5?2*e*e:-1+(4-2*e)*e}const s=e=>{const t=u(e),o=t*.82,l=t*.52,i=t*.22,c=n.getBoundingClientRect(),r=Math.max(c.width,c.height),b=r*.55,h=r*.4,a=r*1.1,w=r*.75,m=r*1.4,f=r*1;n.style.background=`
      radial-gradient(ellipse ${b}px ${h}px at 50% 50%,
        rgba(255,148,45,${o}) 0%,
        rgba(200,72,12,${o*.5}) 45%,
        transparent 75%),
      radial-gradient(ellipse ${a}px ${w}px at 50% 50%,
        rgba(170,50,8,${l}) 0%,
        rgba(80,20,3,${l*.4}) 55%,
        transparent 85%),
      radial-gradient(ellipse ${m}px ${f}px at 50% 50%,
        rgba(100,28,5,${i}) 0%,
        transparent 80%)
    `};s(0),ScrollTrigger.create({trigger:d,start:p,end:$,scrub:!0,onUpdate:e=>{s(e.progress)}})}
