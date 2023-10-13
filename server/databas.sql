CREATE TABLE public.pokemons
(
    id serial NOT NULL,
    winner "char"[] NOT NULL,
    loser "char"[] NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE IF EXISTS public.pokemons
    OWNER to postgres;